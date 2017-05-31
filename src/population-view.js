/**
 * Created by amccollough on 5/25/17.
 */
import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {MsgSourceImageLoaded, MsgReset} from './messages'
import {DataApi} from './data-api'

@inject(DataApi, EventAggregator)
export class PopulationView {
  constructor (api, ea) {
    this.api = api;

    ea.subscribe (MsgSourceImageLoaded, (msg) => {
      this.api.evaluatePhenotypes ();
    });

    ea.subscribe (MsgReset, (msg) => {
      this.api.resetPhenotypes ();
      this.api.evaluatePhenotypes ();
      console.log ("Reset Complete.");
    });
  }

  created () {
    this.population = this.api.getPhenotypes();
  }
}

