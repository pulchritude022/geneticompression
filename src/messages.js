/**
 * Created by amccollough on 5/30/17.
 */

export class MsgNewSourceImage {
  constructor (newImageFile) {
    this.image = newImageFile;
  }
}

export class MsgSourceImageLoaded {}

export class MsgReset {}

export class MsgIterate {

}

export class MsgPopSizeChanged {
  constructor (newPopSize) {
    this.size = newPopSize;
  }
}

export class MsgPopUpdated {

}
