import { NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
@Component({
    selector: 'substitution-modal',
    templateUrl: 'substitution-modal.html'
})
export class SubstitutionModal {
    playerList: any[];
    playerPositions: any = {
        substitutes: []
    };

    /**
     * 
     * @param {ViewController} viewCtrl 
     * @param {NavParams} params 
     */
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        this.playerList = this.params.get('playerList');
        this.playerPositions = this.params.get('playerPositions');
        console.debug('[SubstitutionModal] - constructor', this.playerList, this.playerPositions);
    }

    /**
     * 
     */
    validate() {
        console.debug('[SubstitutionModal] - validate', this.playerPositions);
        this.viewCtrl.dismiss({ playerPositions: this.playerPositions });
    }

    /**
     * 
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }
}