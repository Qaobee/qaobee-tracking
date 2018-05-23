import { TranslateService } from '@ngx-translate/core';
import { Component, Input, ViewChild } from '@angular/core';
import { APIStatsService } from '../../providers/api/api.stats';
import { AuthenticationService } from '../../providers/authentication.service';
import { Chart } from 'chart.js';

@Component({
    selector: 'stats-highligths-by-quarter',
    templateUrl: 'stats-highligths-by-quarter.html'
})
export class StatsHighligthsByQuarterComponent {

    @Input() ownerId: any[] = [];

    @ViewChild('barCanvas') barCanvas;
    barChart: any;
    statsNotFound: boolean = true;

    intervalOk15: any[] = [];
    intervalOk30: any[] = [];
    intervalOk45: any[] = [];
    intervalOk60: any[] = [];

    intervalKo15: any[] = [];
    intervalKo30: any[] = [];
    intervalKo45: any[] = [];
    intervalKo60: any[] = [];

    /**
     *
     * @param {APIStatsService} statsService
     * @param {TranslateService} translateService
     * @param {AuthenticationService} authenticationService
     */
    constructor(private statsService: APIStatsService,
                private translateService: TranslateService,
                private authenticationService: AuthenticationService) {
    }

    /**
     *
     */
    ngOnChanges() {
        //actions positives
        let indicatorsOk = [ 'neutralization', 'forceDef', 'contre', 'interceptionOk',
            'stopGKDef', 'penaltyObtained', 'exclTmpObtained', 'shift',
            'duelWon', 'passDec', 'goalScored' ];
        let search = {
            listIndicators: indicatorsOk,
            listOwners: this.ownerId,
            startDate: this.authenticationService.meta.season.startDate,
            endDate: this.authenticationService.meta.season.endDate,
            aggregat: 'COUNT'
        };
        //get actions positives
        this.statsService.getListDetailValue(search).subscribe((result: any[]) => {
            if (result.length > 0) {
                this.statsNotFound = false;
                for (let index = 0; index < result.length; index++) {
                    const element = result[ index ];
                    //Positive action in the first quarter
                    if (element.chrono < 901) {
                        this.intervalOk15.push(element);
                    }

                    //Positive action in the second quarter
                    if (element.chrono >= 901 && element.chrono < 1801) {
                        this.intervalOk30.push(element);
                    }

                    //Positive action in the third quarter
                    if (element.chrono >= 1801 && element.chrono < 2701) {
                        this.intervalOk45.push(element);
                    }

                    //Positive action in the last quarter
                    if (element.chrono >= 2701) {
                        this.intervalOk60.push(element);
                    }
                }
            }
            this.getActionsNegatives();
        })
    }

    /**
     *
     */
    getActionsNegatives() {
        //actions negatives
        let indicatorsKo = [ 'penaltyConceded', 'interceptionKo', 'duelLoose',
            'badPosition', 'forceAtt', 'marcher', 'doubleDribble',
            'looseball', 'foot', 'zone', 'stopGKAtt', 'goalConceded' ];
        let search = {
            listIndicators: indicatorsKo,
            listOwners: this.ownerId,
            startDate: this.authenticationService.meta.season.startDate,
            endDate: this.authenticationService.meta.season.endDate,
            aggregat: 'COUNT'
        };

        //get actions negatives
        this.statsService.getListDetailValue(search).subscribe((result: any[]) => {
            if (result.length > 0) {
                this.statsNotFound = false;
                for (let index = 0; index < result.length; index++) {
                    const element = result[ index ];
                    //Negative action in the first quarter
                    if (element.chrono < 901) {
                        this.intervalKo15.push(element);
                    }

                    //Negative action in the second quarter
                    if (element.chrono >= 901 && element.chrono < 1801) {
                        this.intervalKo30.push(element);
                    }

                    //Negative action in the third quarter
                    if (element.chrono >= 1801 && element.chrono < 2701) {
                        this.intervalKo45.push(element);
                    }

                    //Negative action in the last quarter
                    if (element.chrono >= 2701) {
                        this.intervalKo60.push(element);
                    }
                }
            }
            this.buildChart();
        })
    }

    /**
     *
     */
    buildChart() {
        let labels = 'component.stats.highlights.quarter';
        this.translateService.get(labels).subscribe(
            value => {
                this.barChart = new Chart(this.barCanvas.nativeElement, {
                        type: 'bar',
                        data: {
                            labels: [ "15'", "30'", "45'", "60'" ],
                            datasets: [ {
                                label: value.actionsOk,
                                data: [ this.intervalOk15.length, this.intervalOk30.length, this.intervalOk45.length, this.intervalOk60.length ],
                                backgroundColor: [
                                    'rgba(139,195,74,0.5)',
                                    'rgba(139,195,74,0.5)',
                                    'rgba(139,195,74,0.5)',
                                    'rgba(139,195,74,0.5)'
                                ],
                                borderColor: [
                                    'rgba(139,195,74,1)',
                                    'rgba(139,195,74,1)',
                                    'rgba(139,195,74,1)',
                                    'rgba(139,195,74,1)'
                                ],
                                borderWidth: 1
                            },
                                {
                                    label: value.actionsKo,
                                    data: [ this.intervalKo15.length, this.intervalKo30.length, this.intervalKo45.length, this.intervalKo60.length ],
                                    backgroundColor: [
                                        'rgba(234,83,80,0.8)',
                                        'rgba(234,83,80,0.8)',
                                        'rgba(234,83,80,0.8)',
                                        'rgba(234,83,80,0.8)'
                                    ],
                                    borderColor: [
                                        'rgba(234,83,80,1)',
                                        'rgba(234,83,80,1)',
                                        'rgba(234,83,80,1)',
                                        'rgba(234,83,80,1)'
                                    ],
                                    borderWidth: 1
                                } ]
                        },
                        options: {
                            scales: {
                                yAxes: [ {
                                    ticks: {
                                        beginAtZero: true
                                    }
                                } ]
                            }
                        }
                    }
                );
            });
    }
}
