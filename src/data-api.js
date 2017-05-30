/**
 * Created by amccollough on 5/25/17.
 */
import {Phenotype} from './phenotype'

const INITIAL_POP_COUNT = 12;

let sourceImageData = [];
let phenotypes = [];

for (let i=0; i < INITIAL_POP_COUNT; i++) {
  let pheno = new Phenotype(300,300);
  pheno.updateCanvas();
  phenotypes.push(pheno)
}

let mutationRate = 5;


export class DataApi {
  constructor () {
    this.sourceLoaded = false;
    this.sourceImgUrl = "";
  }

  loadSourceImg (img){
    if (img) {
      console.log(URL.createObjectURL(img));
      this.sourceImgUrl = URL.createObjectURL(img);
      this.sourceLoaded = true;

      // Save off the Image data by transforming into a temporary canvas
      let sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = 300;
      sourceCanvas.height = 300;
      let tempImage = new Image (300,300);
      tempImage.src = this.sourceImgUrl;
      tempImage.onload = () => {
        console.log("Loaded!");
        sourceCanvas.getContext('2d').drawImage(tempImage, 0, 0);
        sourceImageData = Array.from (sourceCanvas.getContext('2d').getImageData(0,0,300,300).data);
        this.evaluatePhenotypes();
      };

    }
    else {
      this.sourceImgUrl = "";
      this.sourceLoaded = false;
    }
  }

  getPhenotypes () {
    return phenotypes;
  }

  evaluatePhenotypes () {
    if (sourceImageData.length > 0){
      phenotypes.forEach((currentValue, index, array) => {
        console.log(index, currentValue.comparePixels(sourceImageData));
      })
    }
  }
}

