import {inject} from 'aurelia-framework'
import {DataApi} from './data-api'

@inject(DataApi)
export class App {
  constructor (api) {
    this.api = api;
  }

  configureRouter(config, router){
    config.title = 'Select an Image';
    config.map([
      {route: '',           moduleId: 'main-view'},
      {route: 'population', moduleId: 'population-view',        name: 'population'},
      {route: 'settings',   moduleId: 'advanced-settings-view', name: 'advanced'}
    ]);

    this.router = router;
  }
}