import { Component } from '@angular/core';

/**
 * Generated class for the StatsShootEfficiencyComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'stats-shoot-efficiency',
  templateUrl: 'stats-shoot-efficiency.html'
})
export class StatsShootEfficiencyComponent {

  text: string;

  constructor() {
    console.log('Hello StatsShootEfficiencyComponent Component');
    this.text = 'Hello World';
  }

}
