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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { PersonService } from './../../../providers/api/api.person.service';
import { APIStatsService } from './../../../providers/api/api.stats';

import moment from 'moment';

@Component({
  selector: 'page-player-stats',
  templateUrl: 'player-stats.html',
})
export class PlayerStatsPage {

  player: any;
  stats: any[] = [];

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
    private translateService: TranslateService) {

      this.player = navParams.get('player');

      // goal scored or stopped
      let indicators = [];
      let listFieldsGroupBy = ['code'];
      let ownerId = [this.player._id];

      if (this.player.status.positionType.code === 'goalkeeper') {
        indicators = ['goalConceded','originShootDef'];
      } else {
        indicators = ['goalScored','originShootAtt'];
      }

      let search = {
        listIndicators: indicators,
        listOwners: ownerId,
        startDate: moment("01/07/2017", "DD/MM/YYYY").valueOf(),
        endDate: moment("30/06/2018", "DD/MM/YYYY").valueOf(),
        aggregat: 'COUNT',
        listFieldsGroupBy: listFieldsGroupBy
      }
      console.log('search', search);

      this.statsService.getStatGroupBy(search).subscribe((result: any[]) => {
        console.log('result', result);
        for (let index = 0; index < result.length; index++) {
          this.stats.push(result[index]);
        }
        console.log('this.stats', this.stats);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerStatsPage');
  }

}
