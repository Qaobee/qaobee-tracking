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
import { APIStatsService } from './../../../providers/api/api.stats';
import { AuthenticationService } from './../../../providers/authentication.service';
import { CollectService } from './../../../providers/api/api.collect.service';

@Component({
  selector: 'page-event-stats',
  templateUrl: 'event-stats.html',
})
export class EventStatsPage {

  event: any;
  collect: any;
  ownerId: any[] = [];
  scoreHome: number = 0;
  scoreVisitor: number = 0;
  statsNotFound: boolean = false;

  /**
   *
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private collectService: CollectService,
              private authenticationService: AuthenticationService,
              private statsService: APIStatsService) {
    this.event = navParams.get('event');
    this.ownerId.push(this.event._id);
    this.retriveCollects(this.event);
    this.getStats();
  }

  /**
   * 
   * @param event 
   */
  private retriveCollects(event: any[]) {
    
      this.collectService.getCollects(
        this.authenticationService.meta._id,
        this.event._id, null, null,
        this.authenticationService.meta.season.startDate,
        this.authenticationService.meta.season.endDate
      ).subscribe((collects: any[]) => {
        if(collects.length>0) {
          this.collect = collects[0];
          console.log('collect',collects[0]);
        }
      });
  }

  /**
   * 
   */
  getStats(){
    //actions negatives                    
    let indicators = ['neutralization', 'forceDef', 'contre', 'interceptionOk', 
                        'stopGKDef', 'penaltyObtained', 'exclTmpObtained', 'shift', 
                        'duelWon', 'passDec', 'goalScored', 'penaltyConceded', 
                        'interceptionKo', 'duelLoose', 'badPosition', 'forceAtt', 
                        'marcher', 'doubleDribble', 'looseball', 'foot', 'zone', 
                        'stopGKAtt', 'goalConceded' ];
    let search = {
      listIndicators: indicators,
      listOwners: this.ownerId,
      startDate: this.authenticationService.meta.season.startDate,
      endDate: this.authenticationService.meta.season.endDate,
      aggregat: 'COUNT'
    };

    //get actions negatives
    this.statsService.getListDetailValue(search).subscribe((result: any[]) => {
      if(result.length>0){
        this.statsNotFound = false;
        console.log('result',result);
        let goalConceded = 0;
        let goalScored = 0;
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          if(element.code==='goalConceded'){
            goalConceded = goalConceded +1
          }

          if(element.code==='goalScored'){
            goalScored = goalScored +1
          }
        }

        // Gestion score en fonction match à domicile ou extérieur
        if(this.event.participants.teamHome.adversary){
          this.scoreHome = goalConceded;
          this.scoreVisitor = goalScored;
        } else {
          this.scoreVisitor = goalConceded;
          this.scoreHome = goalScored;
        }
      } 
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventStatsPage');
  }

  deleteCollect() {
    console.log('deleteCollect EventStatsPage');
  }

}
