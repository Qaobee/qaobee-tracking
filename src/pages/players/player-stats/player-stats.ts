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
import { PersonService } from './../../../providers/api/api.person.service';
import { APIStatsService } from './../../../providers/api/api.stats';
import { AuthenticationService } from './../../../providers/authentication.service';

import { Chart } from 'chart.js';

@Component({
  selector: 'page-player-stats',
  templateUrl: 'player-stats.html',
})
export class PlayerStatsPage {

  player: any;
  stats: any[] = [];

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
 
  barChart: any;
  doughnutChart: any;

  /**
   * 
   * @param navCtrl 
   * @param navParams 
   * @param personService 
   * @param statsService 
   * @param translateService 
   */
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private personService: PersonService,
    private statsService: APIStatsService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService) {

      this.player = navParams.get('player');

      // goal scored or stopped
      let indicators = [];
      let listFieldsGroupBy = ['code'];
      let ownerId = [this.player._id];

      if (this.player.status.positionType.code === 'goalkeeper') {
        indicators = ['goalConceded','originShootDef'];
      } else {
        indicators = ['goalScored','originShootAtt','2minutes', 'yellowCard', 'redCard'];
      }

      let search = {
        listIndicators: indicators,
        listOwners: ownerId,
        startDate: this.authenticationService.meta.season.startDate,
        endDate: this.authenticationService.meta.season.endDate,
        aggregat: 'COUNT',
        listFieldsGroupBy: listFieldsGroupBy
      }

      this.statsService.getStatGroupBy(search).subscribe((result: any[]) => {
        for (let index = 0; index < result.length; index++) {
          let stat = {"code": result[index]._id.code, "value":result[index].value};
          this.stats.push(stat);
          console.log('stat', stat);
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
            'rgba(139,195,74,1)',
            'rgba(139,195,74,1)',
            'rgba(139,195,74,1)',
            'rgba(139,195,74,1)'
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
            'rgba(234,83,80,1)',
            'rgba(234,83,80,1)',
            'rgba(234,83,80,1)',
            'rgba(234,83,80,1)'
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
                      beginAtZero:false
                  }
              }]
          }
      }
    });

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ["Buts marqués", "Tirs ratés"],
        datasets: [{
          label: 'nb de buts',
          data: [this.stats[0].value, (this.stats[1].value-this.stats[0].value)],
          backgroundColor: [
            'rgba(234,83,80,1)',
            'rgba(236, 239, 241, 1)'
          ],
          borderWidth: 2,
          hoverBackgroundColor: [
            'rgba(234,83,80,1)',
            'rgba(236, 239, 241, 1)'
          ]
        }]
      }
    });
  }
}
