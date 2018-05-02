import { StatsEventService } from './../../pages/events/stats.event.service';
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
import { EventStatsModel } from './../../model/event.stats';
 
@Component({
  selector: 'stats-collect-time-sheet',
  templateUrl: 'stats-collect-time-sheet.html'
})
export class StatsCollectTimeSheetComponent {
  
  @Input() eventId: string = '';
  eventStats: EventStatsModel;
  
  /**
   * 
   * @param statsService 
   * @param translateService 
   * @param authenticationService 
   */
  constructor(private translateService: TranslateService,
              private statsEventService: StatsEventService) {
     this.statsEventService.getEventStats(this.eventId).subscribe(res => this.eventStats.event = res);
  }

  /**
   * 
   */
  ngOnChanges(){
    
    // List of positives actions
    let actionsPositives = ['goalScored', 'neutralization', 'forceDef', 'contre', 'interceptionOk', 
                      'stopGKDef', 'penaltyObtained', 'exclTmpObtained', 'shift', 'duelWon', 'passDec'];
    
    // List of negatives actions                      
    let actionsNegatives = ['goalConceded', 'penaltyConceded', 'interceptionKo', 'duelLoose', 'badPosition', 'forceAtt', 
                      'marcher', 'doubleDribble', 'looseball', 'foot', 'zone'];
    
    
  }
}
