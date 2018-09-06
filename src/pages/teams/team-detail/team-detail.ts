/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.  Qaobee
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

import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { TeamUpsertPage } from '../team-upsert/team-upsert';
import { TeamStatsPage } from '../team-stats/team-stats';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-team-detail',
    templateUrl: 'team-detail.html',
})
export class TeamDetailPage {

    team: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AlertController} alertCtrl
     * @param {TranslateService} translateService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private alertCtrl: AlertController,
                private translateService: TranslateService,
                private ga: GoogleAnalytics) {
        this.team = navParams.get('team');
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('TeamDetailPage');
    }

    /**
     *
     */
    editTeam() {
        this.navCtrl.push(TeamUpsertPage, {editMode: 'UPDATE', team: this.team});
    }

    /**
     *
     * @param {string} confirmLabels
     * @param {string} desactived
     */
    desactivateTeam(confirmLabels: string, desactived: string) {
        this.translateService.get(confirmLabels).subscribe(
            value => {
                let alert = this.alertCtrl.create({
                    title: value.title,
                    message: value.message,
                    buttons: [
                        {
                            text: value.buttonLabelCancel,
                            role: 'cancel',
                            handler: () => {
                            }
                        },
                        {
                            text: value.buttonLabelConfirm,
                            handler: () => {
                                this.team.desactivated = desactived;
                                /*
                                this.personService.updatePerson(this.team).subscribe(person => {
                                    console.debug('[teamDetailPage] - desactivateteam - updatePerson', person);
                                });
                                */
                            }
                        }
                    ]
                });
                alert.present();
            }
        )
    }

    /**
     *
     */
    goToStats() {
        this.navCtrl.push(TeamStatsPage, {team: this.team});
    }

}
