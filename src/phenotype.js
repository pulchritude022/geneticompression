/**
 * Created by amccollough on 5/23/17.
 */
let math = require('mathjs');

export class Phenotype {
  constructor (width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.url = "";
    this.randomize ();
  }

  randomize () {
    console.log ("Randomized");
    this.nodeR = this._getRandomOperatorNode ();
    this.nodeG = this._getRandomOperatorNode ();
    this.nodeB = this._getRandomOperatorNode ();
    this.match = 0; // current match strength against source image, range 0..1
  }

  // Rate is the mutation rate as a fraction of one ex 5% is rate = 0.05
  Mutate (rate) {
    // TODO Fill in the mutation functions

    // Jiggle constant values
    // Replace some constant values
    //
  }

  getFormula (channel) {
    switch (channel) {
      case "R":
        return this.nodeR.toString();
      case "G":
        return this.nodeG.toString();
      case "B":
        return this.nodeB.toString();
    }
    return "";
  }

  dumpFormula () {
    let R, G, B, A;
    [R, G, B, A] = this.getRGBAForumlas ();
    let str = `R: ${R}, G: ${G}, B: ${B}, A: ${A}`;
    console.log(str);
    return str;
  }

  getRGBAForumlas () {
    return [
      this.nodeR.toString(),
      this.nodeG.toString(),
      this.nodeB.toString(),
      "255"
    ];
  }

  updateCanvas () {
    let ctx = this.canvas.getContext("2d");
    let imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    let eqR = this.nodeR.compile ();
    let eqG = this.nodeG.compile ();
    let eqB = this.nodeB.compile ();

    for (var y = 0; y < this.canvas.height; y++)
    {
      for (var x = 0; x < this.canvas.width; x++)
      {
        let scope = {
          x: x,
          y: y
        }
        var offset = y * (this.canvas.width*4) + (x * 4);
        imageData.data[offset + 0] = eqR.eval(scope);
        imageData.data[offset + 1] = eqG.eval(scope);
        imageData.data[offset + 2] = eqB.eval(scope);
        imageData.data[offset + 3] = 255;
      }
    }
    ctx.putImageData(imageData,0,0);
    this.url = this.canvas.toDataURL();
  }

  getCanvas () {
    return this.canvas;
  }

  // sourceData must be a 360000 element array, corresponding to a 300x300 pixel image.
  // return 0..1 -- 1 is perfect match, 0 is no match
  comparePixels (sourceData) {
    // Calculate the square of the distance between each pixel
    let ctx1 = math.matrix(Array.from (this.canvas.getContext("2d").getImageData(0, 0, this.canvas.width, this.canvas.height).data));
    let ctx2 = math.matrix(sourceData);
    ctx1 = math.subtract(ctx1, ctx2);
    ctx1 = math.dotMultiply(ctx1, ctx1);
    this.match = 1-((math.sum(ctx1)/math.size(ctx1).get([0]))/(255*255)) ;
    return this.match;
  }

  _getRandomEquation (numOps) {
    let rootNode = this._getRandomConstNode();
    // If a single sized operator is requested, return just a cosntant, otherwise proceed
    if (numOps >= 1) {
      rootNode = this._getRandomOperatorNode ();

      // Loop through nodes and pick a random symbol or constant node to replace with an operator node
      for (let i = 1; i < numOps; i++) {
        let nodes = rootNode.filter((node) => {return node.isSymbolNode || node.isConstantNode;});
        let replacedNode = math.pickRandom(nodes);
        rootNode.transform ((node, path, parent) => {
          if (node.equals(replacedNode)) {
            return this._getRandomOperatorNode ();
          }
          else {
            return node;
          }
        });
      }
      return rootNode;
    }
    return rootNode;
  }

  _getRandomConstNode () {
    const VALUE_WEIGHT = 1;
    const CONST_WEIGHT = 1;
    if (Math.random () < (VALUE_WEIGHT/(VALUE_WEIGHT+CONST_WEIGHT))) {
      // Create a value node
      const X_WEIGHT = 1;
      const Y_WEIGHT = 1;
      return (Math.random () < (X_WEIGHT/(X_WEIGHT+Y_WEIGHT))) ?
        new math.expression.node.SymbolNode ('x') :
        new math.expression.node.SymbolNode ('y');
    }
    else {
      // Create a constant node using a rough approximation of a std distribution centered around 0
      const MAX_CONST = 100;
      return new math.expression.node.ConstantNode(math.round ((((Math.random() + Math.random() + Math.random() + Math.random()) - 2) / 2) * MAX_CONST, 2));
    }
  }

  _getRandomOperatorNode () {
    let a = this._getRandomConstNode ();
    let b = this._getRandomConstNode ();
    let weightedOperations = [
      {w: 5, args: ['add', [a, b]] },
      {w: 5, args: ['subtract', [a, b]] },
      {w: 5, args: ['multiply', [a, b]] },
      {w: 5, args: ['divide', [a, b]] },
      {w: 3, args: ['pow', [a, b]] },
      {w: 1, args: ['abs', [a]] },
      {w: 2, args: ['cube', [a]] },
      {w: 1, args: ['exp', [a]] },
      {w: 1, args: ['log', [a, b]] },
      {w: 1, args: ['pow', [a, b]] },
      {w: 1, args: ['sign', [a]] },
      {w: 2, args: ['sqrt', [a]] },
      {w: 2, args: ['square', [a]] },
      {w: 1, args: ['unaryMinus', [a]] },
      {w: 2, args: ['sin', [a]] },
      {w: 2, args: ['cos', [a]] },
      {w: 2, args: ['tan', [a]] },
      {w: 2, args: ['asin', [a]] },
      {w: 2, args: ['acos', [a]] },
      {w: 2, args: ['atan', [a]] },
      {w: 2, args: ['sinh', [a]] },
      {w: 2, args: ['cosh', [a]] },
      {w: 2, args: ['tanh', [a]] },
    ];
    let args = math.pickRandom(weightedOperations, weightedOperations.map ((x) => {return x.w;})).args;
    return new math.expression.node.FunctionNode(...args);
  }
}
