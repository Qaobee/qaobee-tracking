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

import { TeamDetailPage } from '../team-detail/team-detail';
import { TeamUpsertPage } from '../team-upsert/team-upsert';
import { Component } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { AuthenticationService } from '../../../providers/authentication.service';
import { TeamStatsPage } from '../team-stats/team-stats';
import { TeamService } from '../../../providers/api/api.team.service';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-team-list',
    templateUrl: 'team-list.html',
})
export class TeamListPage {

    myTeams: any;
    myTeamListSize: number;
    adversaryTeamListSize: number;
    teamListFiltred: any;

    /**
     * .
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {TeamService} teamService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: Storage,
                private teamService: TeamService,
                private authenticationService: AuthenticationService,
                private ga: GoogleAnalytics) {
        this.retrieveTeamList();
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('TeamListPage');
        this.retrieveTeamList();
    }

    /**
     * call personneService for retrieve team list from database
     * @param refresher
     */
    private getTeams(refresher: Refresher) {
        // Retreive my team list
        this.teamService.getTeams(this.authenticationService.meta.effectiveDefault, this.authenticationService.meta._id, 'all', 'false').subscribe((teams: any[]) => {
            if (teams) {
                this.myTeams = [];
                teams.forEach(item => {
                    if (!item.adversary) {
                        this.myTeams.push(item);
                    }
                });
                this.storage.set(this.authenticationService.meta._id + '-teams',teams);
                this.myTeamListSize = this.myTeams.lenght;
            }
            if (refresher) {
                refresher.complete();
            }
        });
    }

    /**
     * if teams exist then return list, else, call personneService
     */
    private retrieveTeamList() {
        this.storage.get(this.authenticationService.meta._id + '-teams').then(teams => {
            if (!teams) {
                this.getTeams(null);
            } else {
                this.myTeams= teams;
            }
        })
    }

    /**
     *
     */
    goToAddteam() {
        this.navCtrl.push(TeamUpsertPage, {editMode: 'CREATE', adversary:false});
    }

    /**
     *
     * @param team
     * @param clickEvent
     */
    goToDetail(team: any, clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(TeamDetailPage, {team: team});
    }

    /**
     *
     */
    goToStats(team: any, clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(TeamStatsPage, {team: team});
    }

}
