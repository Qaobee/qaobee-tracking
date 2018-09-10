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
import { APIStatsService } from '../../../providers/api/api.stats';
import { AuthenticationService } from "../../../providers/authentication.service";
import { Utils } from '../../../providers/utils';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-team-stats',
    templateUrl: 'team-stats.html',
})
export class TeamStatsPage {

    team: any;
    ownerId: any[] = [];
    numberMatch: number = 0;
    numberHolder: number = 0;
    avgPlaytime: number = 0;
    stats: any[] = [];

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {APIStatsService} statsService
     * @param {AuthenticationService} authenticationService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private statsService: APIStatsService,
                private authenticationService: AuthenticationService,
                private ga: GoogleAnalytics) {

        this.team = navParams.get('team');
        this.ownerId.push(this.team._id);
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('TeamStatsPage');
        this.searchTeamUse();
    }

    /**
     *
     */
    searchTeamUse() {

        // holder vs substitue
        let indicators = [ 'holder', 'substitue' ];
        let listFieldsGroupBy = [ 'code' ];

        let search = {
            listIndicators: indicators,
            listOwners: this.ownerId,
            startDate: this.authenticationService.statStartDate,
            endDate: this.authenticationService.statEndDate,
            aggregat: 'COUNT',
            listFieldsGroupBy: listFieldsGroupBy
        };

        this.statsService.getStatGroupBy(search).subscribe((result: any[]) => {
            if (result.length > 0) {
                for (let index = 0; index < result.length; index++) {
                    const element = result[ index ];

                    if (element._id.code === 'holder') {
                        this.numberHolder = element.value;
                        this.numberMatch = this.numberMatch + element.value;
                    }
                    if (element._id.code === 'substitue') {
                        this.numberMatch = this.numberMatch + element.value;
                    }
                }

                //Total playtime
                indicators = [ 'totalPlayTime' ];

                search = {
                    listIndicators: indicators,
                    listOwners: this.ownerId,
                    startDate: this.authenticationService.statStartDate,
                    endDate: this.authenticationService.statEndDate,
                    aggregat: 'SUM',
                    listFieldsGroupBy: listFieldsGroupBy
                };

                this.statsService.getStatGroupBy(search).subscribe((result: any[]) => {
                    if (result.length > 0) {
                        this.avgPlaytime = Utils.precisionRound(result[ 0 ].value / (60 * this.numberMatch), -1);
                    }
                });
            }
        });
    }
}
