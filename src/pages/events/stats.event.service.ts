import { HttpClientModule } from '@angular/common/http';
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

import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import {AuthenticationService} from "../../providers/authentication.service";
import { PersonService } from '../../providers/api/api.person.service';
import { APIStatsService } from '../../providers/api/api.stats';
import { CollectService } from '../../providers/api/api.collect.service';
import { EventStatsModel } from './../../model/event.stats';
import { HttpClient } from "@angular/common/http";


@Injectable()
export class StatsEventService  {

  /**
   * 
   * @param storage 
   * @param collectService 
   * @param authenticationService 
   * @param statsService 
   * @param personService 
   */
  constructor(private storage: Storage,
              private collectService: CollectService,
              private authenticationService: AuthenticationService,
              private statsService: APIStatsService,
              private personService: PersonService) {
    
  }

  /**
   * @function getEventStats
   * @description Retrieve and organize all inforamtions to view statistic's event
   * @param event 
   */
  getEventStats(event: any) : EventStatsModel{
    
    let keyStorage = this.authenticationService.meta._id+'-'+event._id;
    this.storage.get(keyStorage).then(eventStats => {
      if(eventStats){
        return eventStats;
      } else { 
        let eventStats = new EventStatsModel();
        eventStats.event = event;
        console.log('getEventStats',eventStats);
        return this.retrieveCollect(eventStats);
      }
    })
    return;
  }

  /**
   * Get collect information for an event
   */
  private retrieveCollect(eventStats: EventStatsModel) {
    
    this.collectService.getCollects(
      this.authenticationService.meta._id,
      eventStats.event._id, null, null,
      this.authenticationService.meta.season.startDate,
      this.authenticationService.meta.season.endDate
    ).subscribe((collects: any[]) => {
      if(collects.length>0) {
        eventStats.collect = collects[0];
        console.log('retrieveCollect',eventStats);
        return this.getListPlayerEvent(eventStats);
      }
    });
  }

  /**
   * Retrieve informations on player who participate to event
   */
  private getListPlayerEvent(eventStats: EventStatsModel) {
    let listField = ['_id', 'name', 'firstname', 'status'];

    this.personService.getListPerson(eventStats.collect.players, listField).subscribe((playersInfos: any[]) => {
      if(playersInfos && playersInfos.length>0) {
        for (let index = 0; index < playersInfos.length; index++) {
          let player = playersInfos[index];
          eventStats.playerList.push(player);
        }
        console.log('getListPlayerEvent',eventStats);
        return this.getStatDetailForEvent(eventStats);
      }
    })
  }

  /**
   * Get list of stats for an event
   */
  private getStatDetailForEvent(eventStats: EventStatsModel){                   
    
    this.statsService.getListForEvent(eventStats.event._id).subscribe((result: any) => {
      if(result && result.stats.length>0){
        eventStats.statList = result.stats;
        this.storage.set(this.authenticationService.meta._id+'-'+eventStats.event._id, eventStats);
        console.log('getListDetailValue',eventStats);
        return eventStats;
      }
    })
  }
}