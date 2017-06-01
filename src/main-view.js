/**
 * Created by amccollough on 5/25/17.
 */
import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {BindingSignaler} from 'aurelia-templating-resources';
import {MsgNewSourceImage} from './messages'
import {DataApi} from './data-api'

@inject(DataApi, EventAggregator, BindingSignaler)
export class MainView {
  constructor (api, ea, signaler) {
    this.api = api;
    this.ea = ea;
    this.signaler = signaler;
    this.noImageMessage = "Please select a source image."

    ea.subscribe (MsgNewSourceImage, (msg) => {
      // New Image so new best match.
      this.bestMatch = this.api.getPhenotypes ()[0];
      // Need to use a signaler because the binding is to complex to pick up automatically
      this.signaler.signal ("need-update");
      console.log ("New Source Image Detected");
    });
  }

  created () {
    this.bestMatch = this.api.getPhenotypes ()[0];
  }
}
