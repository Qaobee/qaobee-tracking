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
import { PersonService } from '../../../providers/api/api.person.service';
import { APIStatsService } from '../../../providers/api/api.stats';
import { CollectService } from './../../../providers/api/api.collect.service';
import { AuthenticationService } from '../../../providers/authentication.service';
import { Utils } from './../../../providers/utils';

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

  }

  /**
   * 
   */
  ionViewDidEnter(){
    this.searchPlayerUse();
  }

  /**
   * 
   */
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
            this.avgPlaytime = Utils.precisionRound(result[0].value/(60*this.numberMatch),-1);
          }
        });
      }
    });
  }
}
