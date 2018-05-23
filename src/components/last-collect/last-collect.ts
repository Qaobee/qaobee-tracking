import { Component } from '@angular/core';

@Component({
    selector: 'last-collect',
    templateUrl: 'last-collect.html'
})
export class LastCollectComponent {

    text: string;

    /**
     *  TODO
     */
    constructor() {
        console.log('Hello LastCollectComponent Component');
        this.text = 'Hello World';
    }

}
