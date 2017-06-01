/**
 * Created by amccollough on 5/25/17.
 */
import {Phenotype} from './phenotype'

const INITIAL_POP_COUNT = 12;

let popSize = INITIAL_POP_COUNT;
let mutationRate = 0.05;
let sourceImageData = [];
let phenotypes = [];

for (let i=0; i < popSize; i++) {
  let pheno = new Phenotype(300,300);
  pheno.updateCanvas();
  phenotypes.push(pheno)
}



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

  // Re-calculate the fitness function for each phenotype
  evaluatePhenotypes () {
    if (sourceImageData.length > 0){
      phenotypes.forEach((currentValue, index, array) => {
        console.log(index, currentValue.comparePixels(sourceImageData));
      });
      phenotypes.sort((a,b) => {
        if (a.match > b.match) {
          return -1;
        }
        else if (a.match < b.match) {
          return 1;
        }
        return 0;
      });
    }
  }

  // Re-randomize each phenotype
  resetPhenotypes () {
    phenotypes.forEach((p) => {
      p.randomize();
      p.updateCanvas();
    });
  }

  getPopSize () {
    return popSize;
  }

  setPopSize (size) {
    // Only need to update if there is a change
    if (size != popSize) {
      popSize = size;
      console.log (`New Population size ${popSize}`);
      // Regenerate the population by first emptying population array
      phenotypes = [];
      for (let i=0; i < popSize; i++) {
        let pheno = new Phenotype(300,300);
        pheno.updateCanvas();
        phenotypes.push(pheno);
      }
      return true;  // we updated the population size
    }
    return false; // no change was made
  }

  getMutationRate () {
    return mutationRate;
  }

  setMutationRate (rate) {
    if (rate != mutationRate) {
      mutationRate = rate;
      console.log (`New Mutation Rate ${mutationRate}`);
      return true;// we updated the mutation rate
    }
    return false; // no change was made
  }
}

