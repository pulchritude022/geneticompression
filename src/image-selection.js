/**
 * Created by amccollough on 5/25/17.
 */
import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {MsgNewSourceImage} from './messages'
import {DataApi} from './data-api'

@inject(DataApi, EventAggregator)
export class ImageSelection {
  constructor (api, ea) {
    this.api = api;
    this.ea = ea;
  }

  onFilesSelected (event) {
    let img = event.target.files[0];
    this.api.loadSourceImg (img);
    this.ea.publish (new MsgNewSourceImage (img));
  }

  onStart () {
    console.log ("Started!");
  }

}
