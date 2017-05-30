/**
 * Created by amccollough on 5/25/17.
 */
import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {MsgSourceImageLoaded} from './messages'
import {DataApi} from './data-api'

@inject(DataApi, EventAggregator)
export class PopulationView {
  constructor (api, ea) {
    this.api = api;

    ea.subscribe (MsgSourceImageLoaded, (msg) => {
      this.api.evaluatePhenotypes ();
    });
  }

  created () {
    this.population = this.api.getPhenotypes();
  }
}

