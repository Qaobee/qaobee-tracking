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

import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APIStatsService } from '../../providers/api/api.stats';
import { Utils } from "../../providers/utils";

import { Chart } from 'chart.js';


@Component({
    selector: 'stats-shoot-efficiency',
    templateUrl: 'stats-shoot-efficiency.html'
})
export class StatsShootEfficiencyComponent {

    @Input() ownerId: any[] = [];
    @Input() numberMatch: number = 1;
    @Input() positionType: string = '';

    @ViewChild('doughnutCanvas') doughnutCanvas;
    doughnutChart: any;
    statsNotFound: boolean = false;
    efficiencyAverage: number = 0;
    goalAverage: number = 0;
    shootAverage: number = 0;
    goalTotal: number = 0;
    shootTotal: number = 0;
    efficiencyLabel: string = '';
    goalAverageLabel: string = '';
    shootAverageLabel: string = '';


    /**
     *
     * @param statsService
     * @param translateService
     */
    constructor(private statsService: APIStatsService,
                private translateService: TranslateService) {
    }


    /**
     *
     */
    ngOnChanges() {
        // goal scored or stopped
        let indicators = [];
        console.log('StatsShootEfficiencyComponent =>ngOnChanges', this.ownerId);

        let labels = '';
        if (this.positionType && this.positionType === 'goalkeeper') {
            indicators = [ 'goalConceded', 'originShootDef' ];
            labels = 'component.stats.shoot.efficiency.goalkeeper';
        } else {
            indicators = [ 'goalScored', 'originShootAtt' ];
            labels = 'component.stats.shoot.efficiency.player';
        }

        let listFieldsGroupBy = [ 'code' ];
        let search = {
            listIndicators: indicators,
            listOwners: this.ownerId,
            startDate: 0,
            endDate: Date.now(),
            aggregat: 'COUNT',
            listFieldsGroupBy: listFieldsGroupBy
        };

        this.translateService.get(labels).subscribe(
            value => {
                this.efficiencyLabel = value.title;
                this.goalAverageLabel = value.goalAverage;
                this.shootAverageLabel = value.shootAverage;

                this.statsService.getStatGroupBy(search).subscribe((result: any[]) => {
                        if (result.length > 0) {
                            //average efficiency
                            if (this.positionType === 'goalkeeper') {
                                this.efficiencyAverage = Utils.precisionRound((1 - (result[ 0 ].value / result[ 1 ].value)) * 100, 2);
                                this.goalTotal = result[ 0 ].value;
                                this.shootTotal = result[ 1 ].value;
                            } else {
                                this.efficiencyAverage = Utils.precisionRound((result[ 0 ].value / result[ 1 ].value) * 100, 2);
                                this.goalTotal = result[ 0 ].value;
                                this.shootTotal = result[ 1 ].value - result[ 0 ].value;
                            }

                            //average shoot, goal, stop
                            this.goalAverage = Utils.precisionRound(result[ 0 ].value / this.numberMatch, 2);
                            this.shootAverage = Utils.precisionRound(result[ 1 ].value / this.numberMatch, 2);

                            this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                                type: 'doughnut',
                                data: {
                                    labels: [ value.goal, value.shoot ],
                                    datasets: [ {

                                        data: [ this.goalTotal, this.shootTotal ],
                                        backgroundColor: [
                                            'rgba(139,195,74,0.5)',
                                            'rgba(234,83,80,0.8)'
                                        ],
                                        borderWidth: 2,
                                        hoverBackgroundColor: [
                                            'rgba(139,195,74,1)',
                                            'rgba(234,83,80,1)'
                                        ]
                                    } ]
                                }
                            });
                        } else {
                            this.statsNotFound = true;
                            this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                                type: 'doughnut',
                                data: {
                                    labels: [ value.goal, value.shoot ],
                                    datasets: [ {

                                        data: [ this.goalTotal, this.shootTotal ],
                                        backgroundColor: [
                                            'rgba(139,195,74,0.5)',
                                            'rgba(234,83,80,0.8)'
                                        ],
                                        borderWidth: 2,
                                        hoverBackgroundColor: [
                                            'rgba(139,195,74,1)',
                                            'rgba(234,83,80,1)'
                                        ]
                                    } ]
                                }
                            });
                        }
                    }
                )
            });
    }
}
