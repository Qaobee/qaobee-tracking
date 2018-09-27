/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.
 *  Qaobee
 *  All Rights Reserved.
 *
 *  NOTICE: All information contained here is, and remains
 *  the property of Qaobee and its suppliers,
 *  if any. The intellectual and technical concepts contained
 *  here are proprietary to Qaobee and its suppliers and may
 *  be covered by U.S. and Foreign Patents, patents in process,
 *  and are protected by trade secret or copyright law.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from Qaobee.
 */

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