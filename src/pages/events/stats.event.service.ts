import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { AuthenticationService } from "../../providers/authentication.service";
import { PersonService } from '../../providers/api/api.person.service';
import { APIStatsService } from '../../providers/api/api.stats';
import { CollectService } from '../../providers/api/api.collect.service';
import { StatsContainerModel } from '../../model/stats.container';

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
     *
     * @param {string} eventId
     * @returns {Observable<StatsContainerModel>}
     */
    getEventStats(eventId: string): Observable<StatsContainerModel> {
        return new Observable<StatsContainerModel>((observer) => {
            this.storage.get(this.authenticationService.meta._id + '-' + eventId).then(statsContainer => {
                if (statsContainer) {
                    observer.next(statsContainer);
                    observer.complete();
                } else {
                    let statsContainer = new StatsContainerModel();
                    statsContainer.type = 'EVENT';
                    statsContainer.onwerId = eventId;

                    //Get Collect info
                    this.collectService.getCollects(
                        this.authenticationService.meta._id,
                        eventId, null, null,
                        this.authenticationService.meta.season.startDate,
                        this.authenticationService.meta.season.endDate
                    ).subscribe((collects: any[]) => {
                        if (collects.length > 0) {
                            statsContainer.collectList = collects;

                            //get Playerlist
                            const listField = [ '_id', 'name', 'firstname', 'status' ];
                            this.personService.getListPerson(statsContainer.collectList[ 0 ].players, listField).subscribe((playersInfos: any[]) => {
                                if (playersInfos && playersInfos.length > 0) {
                                    for (let index = 0; index < playersInfos.length; index++) {
                                        statsContainer.playerList.push(playersInfos[ index ]);
                                    }
                                    // get Stats
                                    this.statsService.getListForEvent(statsContainer.onwerId).subscribe((result: any) => {
                                        if (result && result.stats.length > 0) {
                                            statsContainer.statList = result.stats;
                                            this.storage.set(this.authenticationService.meta._id + '-' + statsContainer.onwerId, statsContainer);
                                            observer.next(statsContainer);
                                            observer.complete();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}