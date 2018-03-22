import { Component } from '@angular/core';

/**
 * Generated class for the NextEventComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'next-event',
  templateUrl: 'next-event.html'
})
export class NextEventComponent {

  text: string;

  constructor() {
    console.log('Hello NextEventComponent Component');
    this.text = 'Hello World';
  }

}
