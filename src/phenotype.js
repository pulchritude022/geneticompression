/**
 * Created by amccollough on 5/23/17.
 */

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
            this.treeR.getFormula(),
            this.treeG.getFormula(),
            this.treeB.getFormula(),
            "255"
        ];
    }

    updateCanvas () {
        let ctx = this.canvas.getContext("2d");
        let imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        let R, G, B, A;
        [R, G, B, A] = this.getRGBAForumlas ();
        let eqR = math.compile(R);
        let eqG = math.compile(G);
        let eqB = math.compile(B);
        let eqA = math.compile(A);

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

    compareCanvas (canvas) {
        let ctx1 = math.matrix(Array.from (this.canvas.getContext("2d").getImageData(0, 0, this.canvas.width, this.canvas.height).data));
        let ctx2 = math.matrix(Array.from (canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data));
        console.log(`${math.subset(ctx1, math.index(math.range(80000,80008)))} ${math.subset(ctx2, math.index(math.range(80000,80016)))}`);
        // math.multiply(ctx1, -1);
        // console.log(`${math.subset(ctx1, math.index(math.range(80000,80008)))} ${math.subset(ctx2, math.index(math.range(80000,80008)))}`);
        ctx1 = math.subtract(ctx1, ctx2);
        console.log(`${math.subset(ctx1, math.index(math.range(80000,80008)))} ${math.subset(ctx2, math.index(math.range(80000,80008)))}`);
        ctx1 = math.dotMultiply(ctx1, ctx1);
        console.log(`${math.subset(ctx1, math.index(math.range(80000,80008)))} ${math.subset(ctx2, math.index(math.range(80000,80008)))}`);
        console.log(`${math.sum(ctx1)} ${math.size(ctx1).get([0])}`);
        return math.sum(ctx1)/math.size(ctx1).get([0]);
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