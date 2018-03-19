import { Component } from '@angular/core';

/**
 * Generated class for the LastEventComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'last-event',
  templateUrl: 'last-event.html'
})
export class LastEventComponent {

  text: string;

  constructor() {
    console.log('Hello LastEventComponent Component');
    this.text = 'Hello World';
  }

}
