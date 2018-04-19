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

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { PersonService } from './../../providers/api/api.person.service';
import { APIStatsService } from './../../providers/api/api.stats';
import { AuthenticationService } from './../../providers/authentication.service';

import { Chart } from 'chart.js';


@Component({
  selector: 'stats-shoot-efficiency',
  templateUrl: 'stats-shoot-efficiency.html'
})
export class StatsShootEfficiencyComponent {

  @Input() ownerId: any[] = [];
  @Input() numberMatch: number = 1;
  
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;
  efficiencyAverage: number = 0;
  goalAverage: number = 0;
  shootAverage: number = 0;

  /**
   * 
   * @param navCtrl 
   * @param navParams 
   * @param personService 
   * @param statsService 
   * @param translateService 
   * @param authenticationService 
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private personService: PersonService,
              private statsService: APIStatsService,
              private translateService: TranslateService,
              private authenticationService: AuthenticationService) {
  }


  ngOnChanges(){

    // goal scored or stopped
    let indicators = ['goalScored', 'originShootAtt'];
    let listFieldsGroupBy = ['code'];
    let search = {
      listIndicators: indicators,
      listOwners: this.ownerId,
      startDate: this.authenticationService.meta.season.startDate,
      endDate: this.authenticationService.meta.season.endDate,
      aggregat: 'COUNT',
      listFieldsGroupBy: listFieldsGroupBy
    };

    this.statsService.getStatGroupBy(search).subscribe((result: any[]) => {
      if(result.length>0){
        this.efficiencyAverage = this.precisionRound((result[0].value/result[1].value)*100,2);
        this.goalAverage = this.precisionRound(result[0].value/this.numberMatch,2);
        this.shootAverage = this.precisionRound(result[1].value/this.numberMatch,2);

        this.translateService.get('component.stats.shoot.efficiency').subscribe(
          value => {
            this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
              type: 'doughnut',
              data: {
                labels: [value.goal, value.shoot],
                datasets: [{
                  
                  data: [result[0].value, (result[1].value - result[0].value)],
                  backgroundColor: [
                    'rgba(139,195,74,0.5)',
                    'rgba(234,83,80,0.8)'
                  ],
                  borderWidth: 2,
                  hoverBackgroundColor: [
                    'rgba(139,195,74,1)',
                    'rgba(234,83,80,1)'
                  ]
                }]
              }
            });    
          }
        )
      }
    });
  }

  /**
   * 
   * @param number 
   * @param precision 
   */
  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
}
