import { Component } from '@angular/core';

/**
 * Generated class for the LastCollectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'last-collect',
  templateUrl: 'last-collect.html'
})
export class LastCollectComponent {

  text: string;

  constructor() {
    console.log('Hello LastCollectComponent Component');
    this.text = 'Hello World';
  }

}
