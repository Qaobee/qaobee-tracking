import { Observable } from 'rxjs/Observable';
import { HttpClientModule } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { AuthenticationService } from "../../providers/authentication.service";
import { PersonService } from '../../providers/api/api.person.service';
import { APIStatsService } from '../../providers/api/api.stats';
import { CollectService } from '../../providers/api/api.collect.service';
import { EventStatsModel } from './../../model/event.stats';

@Injectable()
export class StatsEventService {

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
  getEventStats(event: any): Observable<EventStatsModel> {
    return new Observable<EventStatsModel>((observer) => {
      let keyStorage = this.authenticationService.meta._id + '-' + event._id;
      this.storage.get(keyStorage).then(eventStats => {
        if (eventStats) {
          observer.next(eventStats);
          observer.complete();
        } else {
          let eventStats = new EventStatsModel();
          eventStats.event = event;
          console.log('getEventStats', eventStats);
          this.retrieveCollect(eventStats).subscribe(res => {
            observer.next(res);
            observer.complete();
          });
        }
      });
    });
  }

  /**
   * Get collect information for an event
   */
  private retrieveCollect(eventStats: EventStatsModel): Observable<EventStatsModel> {
    return new Observable<EventStatsModel>((observer) => {
      this.collectService.getCollects(
        this.authenticationService.meta._id,
        eventStats.event._id, null, null,
        this.authenticationService.meta.season.startDate,
        this.authenticationService.meta.season.endDate
      ).subscribe((collects: any[]) => {
        if (collects.length > 0) {
          eventStats.collect = collects[0];
          console.debug('retrieveCollect', eventStats);
          this.getListPlayerEvent(eventStats).subscribe(res => {
            observer.next(res);
            observer.complete();
          });
        }
      });
    });
  }

  /**
   * Retrieve informations on player who participate to event
   */
  private getListPlayerEvent(eventStats: EventStatsModel): Observable<EventStatsModel> {
    let listField = ['_id', 'name', 'firstname', 'status'];
    return new Observable<EventStatsModel>((observer) => {
      this.personService.getListPerson(eventStats.collect.players, listField).subscribe((playersInfos: any[]) => {
        if (playersInfos && playersInfos.length > 0) {
          for (let index = 0; index < playersInfos.length; index++) {
            let player = playersInfos[index];
            eventStats.playerList.push(player);
          }
          console.log('getListPlayerEvent', eventStats);
          this.getStatDetailForEvent(eventStats).subscribe(res => {
            observer.next(res);
            observer.complete();
          });
        }
      });
    });
  }

  /**
   * Get list of stats for an event
   */
  private getStatDetailForEvent(eventStats: EventStatsModel): Observable<EventStatsModel> {
    return new Observable<EventStatsModel>((observer) => {
      this.statsService.getListForEvent(eventStats.event._id).subscribe((result: any) => {
        if (result && result.stats.length > 0) {
          eventStats.statList = result.stats;
          this.storage.set(this.authenticationService.meta._id + '-' + eventStats.event._id, eventStats);
          console.debug('[StatsEventService] - getListDetailValue', eventStats);
          observer.next(eventStats);
          observer.complete();
        }
      });
    });
  }
}