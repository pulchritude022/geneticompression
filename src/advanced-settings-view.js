/**
 * Created by amccollough on 5/25/17.
 */
import {inject} from 'aurelia-framework'
import {DataApi} from './data-api'

@inject(DataApi)
export class AdvancedSettingsView {
  constructor (api) {
    this.api = api;
  }
}
