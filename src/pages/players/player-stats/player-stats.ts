import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { APIStatsService } from '../../../providers/api/api.stats';
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
   * @param {APIStatsService} statsService
   * @param {AuthenticationService} authenticationService
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private statsService: APIStatsService,
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
