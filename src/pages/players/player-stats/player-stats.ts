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
import { TranslateService } from '@ngx-translate/core';
import { PersonService } from './../../../providers/api/api.person.service';
import { APIStatsService } from './../../../providers/api/api.stats';
import { AuthenticationService } from './../../../providers/authentication.service';

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
      console.log('search', search);

      this.statsService.getStatGroupBy(search).subscribe((result: any[]) => {
        for (let index = 0; index < result.length; index++) {
          let stat = {"code": result[index]._id.code, "value":result[index].value};
          this.stats.push(stat);
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerStatsPage');
  }

}
