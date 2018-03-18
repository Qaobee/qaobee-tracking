import {Component, Input} from '@angular/core';

/**
 * Generated class for the MenuHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'menu-header',
    templateUrl: 'menu-header.html'
})
export class MenuHeaderComponent {
    @Input() user: any;

    constructor() {
    }

}
