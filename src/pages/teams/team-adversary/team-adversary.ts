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
import { NavController, NavParams } from 'ionic-angular';
import { TeamUpsertPage } from '../team-upsert/team-upsert';
import { TeamStatsPage } from '../team-stats/team-stats';
import { AuthenticationService } from '../../../providers/authentication.service';
import { TeamService } from '../../../providers/api/api.team.service';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({ 
    selector: 'page-team-adversary',
    templateUrl: 'team-adversary.html',
})
export class TeamAdversaryPage {

    team: any;
    adversaries: any;
    adversaryTeamListSize: number;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AuthenticationService} authenticationService
     * @param {TeamService} teamService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private teamService: TeamService,
                private authenticationService: AuthenticationService,
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
    editTeam(adversary: boolean) {
        this.navCtrl.push(TeamUpsertPage, {editMode: 'UPDATE', team: this.team, adversary: adversary});
    }

    /**
     *
     */
    goToAddAdversary() {
        this.navCtrl.push(TeamUpsertPage, {editMode: 'CREATE', adversary:true});
    }


    /**
     *
     */
    goToStats() {
        this.navCtrl.push(TeamStatsPage, {team: this.team});
    }

}
