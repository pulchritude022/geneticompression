/**
 * Created by amccollough on 5/25/17.
 */
import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {MsgPopSizeChanged} from './messages'
import {DataApi} from './data-api'

@inject(DataApi, EventAggregator)
export class AdvancedSettingsView {
  constructor (api, ea) {
    this.api = api;
    this.ea = ea;
    this.populationSize = this.api.getPopSize ();
    this.mutationRate = this.api.getMutationRate ();
  }

  saveSettings () {
    if (this.api.setPopSize (this.populationSize)) {
      this.ea.publish (new MsgPopSizeChanged (this.populationSize));
    }
    this.api.setMutationRate(this.mutationRate);
  }
}
