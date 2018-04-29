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

import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APIStatsService } from './../../providers/api/api.stats';
import { AuthenticationService } from './../../providers/authentication.service';
import { Utils } from "../../providers/utils";
 
@Component({
  selector: 'stats-collect-time-sheet',
  templateUrl: 'stats-collect-time-sheet.html'
})
export class StatsCollectTimeSheetComponent {
  
  @Input() collect: any = {};
  playerList: any[] = [];
  
  /**
   * 
   * @param statsService 
   * @param translateService 
   * @param authenticationService 
   */
  constructor(private statsService: APIStatsService,
              private translateService: TranslateService,
              private authenticationService: AuthenticationService) {
    
  }

  /**
   * 
   */
  ngOnChanges(){
    // List of indicators
    let indicators = ['originShootAtt', 'originShootDef','goalScored', 'goalConceded',
                      'yellowCard', 'exclTmp', 'redCard', 'holder', 
                      'penaltyConceded', 'interceptionKo', 'duelLoose', 'badPosition', 'forceAtt', 
                      'marcher', 'doubleDribble', 'looseball', 'foot', 'zone',
                      'neutralization', 'forceDef', 'contre', 'interceptionOk', 
                      'stopGKDef', 'penaltyObtained', 'exclTmpObtained', 'shift', 'duelWon', 'passDec'];
    
    // List of positives actions
    let actionsPositives = ['goalScored', 'neutralization', 'forceDef', 'contre', 'interceptionOk', 
                      'stopGKDef', 'penaltyObtained', 'exclTmpObtained', 'shift', 'duelWon', 'passDec'];
    
    // List of negatives actions                      
    let actionsNegatives = ['goalConceded', 'penaltyConceded', 'interceptionKo', 'duelLoose', 'badPosition', 'forceAtt', 
                      'marcher', 'doubleDribble', 'looseball', 'foot', 'zone'];
    let ownerId = [];
    
    if(this.collect && this.collect.players) {
      for (let index = 0; index < this.collect.players.length; index++) {
        
        let listField = ['_id', 'name', 'firstname', 'status'];
        
        let player:any = {};
        player.id=this.collect.players[index];
        player.firstname = 'toto_'+index;
        player.name = 'tutu_'+index;
        player.status = {};
        player.stats = {
          originShootAtt: 0,originShootDef: 0,goalScored: 0,goalConceded: 0,
          yellowCard: 0,exclTmp: 0,redCard: 0,holder: '',
          totalPlayTime : 0, note : 0
        };

        this.playerList.push(player);
      }
      let listFieldsGroupBy = ['code'];
      let search = {
        listIndicators: indicators,
        listOwners: ownerId,
        startDate: this.authenticationService.meta.season.startDate,
        endDate: this.authenticationService.meta.season.endDate,
        aggregat: 'COUNT',
        listFieldsGroupBy: listFieldsGroupBy
      };
    }
  }
}
