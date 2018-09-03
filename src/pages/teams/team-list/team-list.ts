
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

@Component({
    selector: 'page-team-list',
    templateUrl: 'team-list.html',
})
export class TeamListPage {

    teams: any = {
        myTeams: [],
        adversaries: []
    };
    myTeamListSize: number;
    adversaryTeamListSize: number;
    teamListFiltred: any;

    /**
     * .
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Storage} storage
     * @param {PersonService} personService
     * @param {AuthenticationService} authenticationService
     * @param {TeamService} teamService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: Storage,
                private teamService: TeamService,
                private authenticationService: AuthenticationService) {
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
                this.teams.myTeams = [];
                teams.forEach(item => {
                    if(!item.adversary){
                        this.teams.myTeams.push(item);
                    }
                });
                this.myTeamListSize = this.teams.myTeams.lenght;
            }
        });

        // Retreive adversary team list
        this.teamService.getTeams(this.authenticationService.meta.effectiveDefault, this.authenticationService.meta._id, 'all', 'true').subscribe((teams: any[]) => {
            if (teams) {
                this.teams.adversaries = [];
                teams.forEach(item => {
                    if(item.adversary){
                        this.teams.adversaries.push(item);
                    }
                });
                this.adversaryTeamListSize = this.teams.adversaries.lenght;
            }
        });
    }

    /**
     * if teams exist then return list, else, call personneService
     */
    private retrieveTeamList() {
        this.storage.get(this.authenticationService.meta._id+'-teams').then(teams => {
            if (!teams) {
                this.getTeams(null);
            } else {
                this.teams = teams;
            }
        })
    }

    /**
     * Filter team list
     * @param ev
     */
    searchItems(ev: any) {

        // set val to the value of the ev target
        let val = ev.target.value;
        this.teamListFiltred = [];

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {

            // Reset items back to all of the items
            this.storage.get(this.authenticationService.meta._id+'-teams').then(teams => {
                    for (let index = 0; index < teams.length; index++) {
                        const element = teams[ index ];
                        if (element.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || element.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                            this.teamListFiltred.push(element);
                        }
                    }
                    this.teams = this.teamListFiltred;
                    this.myTeamListSize = this.teamListFiltred.length;
                }
            );
        } else {
            this.retrieveTeamList();
        }
    }

    /**
     *
     */
    goToAddteam() {
        this.navCtrl.push(TeamUpsertPage, {editMode: 'CREATE'});
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
