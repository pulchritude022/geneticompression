/**
 * Created by amccollough on 5/23/17.
 */
let math = require('mathjs');

const OP_VAL = 0;
const OP_X = 1;
const OP_Y = 2;
const OP_ADD = 3;
const OP_SUB = 4;
const OP_MUL = 5;
const OP_DIV = 6;

let CHILD_MAP = {};
CHILD_MAP[OP_VAL] = 0;
CHILD_MAP[OP_X] = 0;
CHILD_MAP[OP_Y] = 0;
CHILD_MAP[OP_ADD] = 2;
CHILD_MAP[OP_SUB] = 2;
CHILD_MAP[OP_MUL] = 2;
CHILD_MAP[OP_DIV] = 2;

export class Phenotype {
    constructor (width, height) {
        this.treeR = new Node(OP_ADD);
        this.treeR.children.push(new Node(OP_X));
        this.treeR.children.push(new Node(OP_MUL));
        this.treeR.children[1].children.push(new Node(OP_Y));
        this.treeR.children[1].children.push(new Node(OP_VAL,1.5));

        this.treeG = new Node(OP_SUB);
        this.treeG.children.push(new Node(OP_X));
        this.treeG.children.push(new Node(OP_Y));

        this.treeB = new Node(OP_MUL);
        this.treeB.children.push(new Node(OP_X));
        this.treeB.children.push(new Node(OP_VAL, 2));

        this.canvas = document.createElement("canvas");

        this.canvas.width = width;
        this.canvas.height = height;

      this.nodeR = this._getRandomEquation (0);
      this.nodeG = this._getRandomEquation (1);
      this.nodeB = this._getRandomEquation (1);

      this.match = 0; // current match strength against source image, range 0..1
    }

    _getRandomEquation (numOps) {
      let rootNode = this._getRandomConstNode();
      if (numOps >= 1) {
        rootNode = this._getRandomOperatorNode ();

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

          return rootNode;
        }
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
        const MAX_CONST = 20;
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

    _getRandomFunctionNode () {
      let a = this._getRandomConstNode ();
      switch (this._getRandomNumber()) {

      }
    }

    _getRandomNumber (max) {
      max = Math.floor(max);
      return Math.floor (Math.random () * max);
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
            // this.treeR.getFormula(),
            // this.treeG.getFormula(),
            // this.treeB.getFormula(),
            this.nodeR.toString(),
            this.nodeG.toString(),
            this.nodeB.toString(),
            "255"
        ];
    }

    updateCanvas () {
        let ctx = this.canvas.getContext("2d");
        let imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        let R, G, B, A;
        [R, G, B, A] = this.getRGBAForumlas ();
        // let eqR = math.compile(R);
        // let eqG = math.compile(G);
        // let eqB = math.compile(B);
        // let eqA = math.compile(A);
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
    }

    getCanvas () {
        return this.canvas;
    }

    // return 0..1 -- 1 is perfect match, 0 is no match
    comparePixels (sourceData) {
        let ctx1 = math.matrix(Array.from (this.canvas.getContext("2d").getImageData(0, 0, this.canvas.width, this.canvas.height).data));
        let ctx2 = math.matrix(sourceData);
          // console.log(`${math.subset(ctx1, math.index(math.range(80000,80008)))} ${math.subset(ctx2, math.index(math.range(80000,80016)))}`);
        ctx1 = math.subtract(ctx1, ctx2);
          // console.log(`${math.subset(ctx1, math.index(math.range(80000,80008)))} ${math.subset(ctx2, math.index(math.range(80000,80008)))}`);
        ctx1 = math.dotMultiply(ctx1, ctx1);
          // console.log(`${math.subset(ctx1, math.index(math.range(80000,80008)))} ${math.subset(ctx2, math.index(math.range(80000,80008)))}`);
          // console.log(`${math.sum(ctx1)} ${math.size(ctx1).get([0])}`);
        this.match = 1-((math.sum(ctx1)/math.size(ctx1).get([0]))/(255*255)) ;
        return this.match;
    }
}

class Node {
    constructor (operation, data = 0) {
        this.op = operation;
        this.data = data;
        this.parent = null;
        this.children = [];
    }

    getFormula () {
        if (CHILD_MAP[this.op] != this.children.length) {
            console.log(`Too many children! Op: ${this.op}, children: ${this.children.length}, desired: ${CHILD_MAP[this.op]}`);
            return "0";
        }

        switch (this.op) {
            case OP_VAL:
                return `${this.data}`;
            case OP_X:
                return "x";
            case OP_Y:
                return "y";
            case OP_ADD:
                return `(${this.children[0].getFormula()}+${this.children[1].getFormula()})`;
            case OP_SUB:
                return `(${this.children[0].getFormula()}-${this.children[1].getFormula()})`;
            case OP_MUL:
                return `(${this.children[0].getFormula()}*${this.children[1].getFormula()})`;
            case OP_DIV:
                return `(${this.children[0].getFormula()}/${this.children[1].getFormula()})`;
        }

    }
}
