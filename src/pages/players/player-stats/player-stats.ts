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

import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { PersonService } from '../../../providers/api/api.person.service';
import { APIStatsService } from '../../../providers/api/api.stats';
import { CollectService } from './../../../providers/api/api.collect.service';
import { AuthenticationService } from '../../../providers/authentication.service';

import { Chart } from 'chart.js';

@Component({
  selector: 'page-player-stats',
  templateUrl: 'player-stats.html',
})
export class PlayerStatsPage {

  player: any;
  ownerId: any[] = [];
  numberMatch: number = 0;
  numberHolder: number = 0;
  avgPlaytime: number = 0;
  stats: any[] = [];

  @ViewChild('barCanvas') barCanvas;
  barChart: any;

  /**
   *
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {PersonService} personService
   * @param {APIStatsService} statsService
   * @param {TranslateService} translateService
   * @param {AuthenticationService} authenticationService
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private personService: PersonService,
              private statsService: APIStatsService,
              private collectService: CollectService,
              private translateService: TranslateService,
              private authenticationService: AuthenticationService) {

    this.player = navParams.get('player');
    this.ownerId.push(this.player._id);

    this.searchPlayerUse();

  }

  searchPlayerUse() {
    
    // holder vs substitue
    let indicators = ['holder', 'substitue'];
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
        for (let index = 0; index < result.length; index++) {
          const element = result[index];

          if(element._id.code==='holder'){
            this.numberHolder = element.value;
            this.numberMatch = this.numberMatch + element.value;
          }
          if(element._id.code==='substitue'){
            this.numberMatch = this.numberMatch + element.value;
          }
        }  
      }
    });

    //Total playtime
    indicators = ['totalPlayTime'];
    
    search = {
      listIndicators: indicators,
      listOwners: this.ownerId,
      startDate: this.authenticationService.meta.season.startDate,
      endDate: this.authenticationService.meta.season.endDate,
      aggregat: 'SUM',
      listFieldsGroupBy: listFieldsGroupBy
    };
    
    this.statsService.getStatGroupBy(search).subscribe((result: any[]) => {
      if(result.length>0){
        this.avgPlaytime = result[0].value;
      }
    });
  }

  ionViewDidEnter() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ["15'", "30'", "45'", "60'"],
        datasets: [{
          label: "Actions positives",
          data: [12, 19, 30, 5],
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
          label: "Actions negatives",
          data: [6, 25, 20, 15],
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
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }
}
