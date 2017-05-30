/**
 * Created by amccollough on 5/25/17.
 */
import {inject} from 'aurelia-framework'
import {DataApi} from './data-api'

@inject(DataApi)
export class MainView {
  constructor (api) {
    this.api = api;
    this.noImageMessage = "Please select a source image."
  }

  created () {
    this.population = this.api.getPhenotypes();
  }
}
