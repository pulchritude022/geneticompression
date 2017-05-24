/**
 * Created by amccollough on 5/22/17.
 */

import {Phenotype} from './phenotype';

export class App {

    constructor() {
        this.heading = "GenetiCompression";
        this.selectedFiles;
        this.images = [];
        this.popCount = 3;

        this.sourceImg = document.createElement("canvas");
        this.sourceImg.width = 200;
        this.sourceImg.height = 200;

        let ctx = this.sourceImg.getContext("2d");
        let imageData = ctx.getImageData(0, 0, this.sourceImg.width, this.sourceImg.height);
        for (var y = 0; y < this.sourceImg.height; y++)
        {
            for (var x = 0; x < this.sourceImg.width; x++)
            {
                let offset = y * (this.sourceImg.width*4) + (x * 4);
                imageData.data[offset + 0] = 50;
                imageData.data[offset + 1] = 100;
                imageData.data[offset + 2] = 150;
                imageData.data[offset + 3] = 255;
            }
        }

        this.outputImg = document.createElement("canvas");
    }

    onStartTraining () {
        console.log("Training Started");
        let startTime = new Date();
        for (let i=0; i < this.popCount; i++) {
            let pheno = new Phenotype(200,200);
            pheno.updateCanvas();
            this.images.push (pheno);

            if (this.selectedFiles.length > 0) {
                let ctx = this.sourceImg.getContext('2d');
                let img = new Image ();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                }
                img.src = URL.createObjectURL(this.selectedFiles[0]);
                console.log (`Average Distance: ${pheno.compareCanvas(this.sourceImg)}`);
            }
        }
        let endTime = new Date();
        console.log(`Time for ${this.popCount} = ${(endTime - startTime)/1000}s (${(endTime - startTime)/this.popCount}ms per image)`);


    }

    onStopTraining () {
        console.log("Training Stopped");
    }

}