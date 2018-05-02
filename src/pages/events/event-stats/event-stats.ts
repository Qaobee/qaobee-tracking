
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
import { StatsEventService } from '../stats.event.service';
import { EventStatsModel } from 'model/event.stats';

@Component({
  selector: 'page-event-stats',
  templateUrl: 'event-stats.html',
})
export class EventStatsPage {

  eventStats: EventStatsModel;
  scoreHome: number = 0;
  scoreVisitor: number = 0;
  statsNotFound: boolean = true;
  keyStorage: string = '';

  /**
   *
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private statsEventService: StatsEventService) {
                  
    this.statsEventService.getEventStats(navParams.get('event'));
    console.log('getListDetailValue',this.eventStats);
    if(this.eventStats) {
      this.getScore();
    }
  }

  

  getScore() {
    if(this.eventStats.statList.length>0){
      
      this.statsNotFound = false;
      let goalConceded = 0;
      let goalScored = 0;
      for (let index = 0; index < this.eventStats.statList.length; index++) {
        const element = this.eventStats.statList[index];
        if(element.code==='goalConceded'){
          goalConceded = goalConceded +1
        }

        if(element.code==='goalScored'){
          goalScored = goalScored +1
        }
      }

      // Gestion score en fonction match à domicile ou extérieur
      if(this.eventStats.event.participants.teamHome.adversary){
        this.scoreHome = goalConceded;
        this.scoreVisitor = goalScored;
      } else {
        this.scoreVisitor = goalConceded;
        this.scoreHome = goalScored;
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventStatsPage');
  }

  deleteCollect() {
    console.log('deleteCollect EventStatsPage');
  }

}
