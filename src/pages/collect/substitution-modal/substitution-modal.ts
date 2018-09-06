import { StatType } from '../../../model/stat.type';
import { NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'substitution-modal',
    templateUrl: 'substitution-modal.html'
})
export class SubstitutionModal {
    playerList: any[];
    sanctions: { playerId: string, sanction: StatType, time: number, position: string }[];
    playerPositions: any = {
        substitutes: []
    };

    /**
     *
     * @param {ViewController} viewCtrl
     * @param {NavParams} params
     * @param {GoogleAnalytics} ga
     */
    constructor(public viewCtrl: ViewController, private params: NavParams,
                private ga: GoogleAnalytics) {
        this.playerList = this.params.get('playerList');
        this.playerPositions = this.params.get('playerPositions');
        this.sanctions = this.params.get('sanctions');
        console.debug('[SubstitutionModal] - constructor', this.playerList, this.playerPositions, this.sanctions);
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('SubstitutionModal');
    }

    /**
     *
     */
    validate() {
        console.debug('[SubstitutionModal] - validate', this.playerPositions);
        this.viewCtrl.dismiss({playerPositions: this.playerPositions});
    }

    /**
     *
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }
}