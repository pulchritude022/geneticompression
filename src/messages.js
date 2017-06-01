/**
 * Created by amccollough on 5/30/17.
 */

// New source image selected by the user.
export class MsgNewSourceImage {
  constructor (newImageFile) {
    this.image = newImageFile;
  }
}

// Message to re-randomize the population
export class MsgReset {}

// Message sent when the population size has been updated in the advanced settings
export class MsgPopSizeChanged {
  constructor (newPopSize) {
    this.size = newPopSize;
  }
}
