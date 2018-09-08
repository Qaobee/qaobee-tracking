import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventsService } from '../../providers/api/api.events.service';
import { AuthenticationService } from '../../providers/authentication.service';
import { EffectiveService } from '../../providers/api/api.effective.service';
import { CollectService } from '../../providers/api/api.collect.service';
import { APIStatsService } from '../../providers/api/api.stats';
import _ from "lodash";
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-synchro',
    templateUrl: 'synchro.html',
})
export class SynchroPage {

    sync: any = {
        events: {
            done: false,
            count: -1
        },
        effectives: {
            done: false,
            count: -1
        },
        collects: {
            done: false,
            count: -1
        },
        stats: {
            done: false,
            count: -1
        }
    };

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Storage} storage
     * @param {EventsService} eventsServices
     * @param {CollectService} collectService
     * @param {EffectiveService} effectiveService
     * @param {APIStatsService} statAPI
     * @param {AuthenticationService} authenticationService
     * @param {GoogleAnalytics} ga
     */
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private storage: Storage,
        private eventsServices: EventsService,
        private collectService: CollectService,
        private effectiveService: EffectiveService,
        private statAPI: APIStatsService,
        private authenticationService: AuthenticationService,
        private ga: GoogleAnalytics
    ) {
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('SynchroPage');
    }


    /**
     *
     */
    syncAll() {
        console.debug('[SynchroPage] - syncAll');
        this.syncEvents().subscribe(count => {
            console.debug('[SynchroPage] - syncAll - events', count);
            this.sync.events.done = true;
            this.sync.events.count = count;
            this.syncStats().subscribe(count => {
                console.debug('[SynchroPage] - syncAll - stats', count);
                this.sync.stats.done = true;
                this.sync.stats.count = count;
            });
        });
        this.syncEffective().subscribe(count => {
            console.debug('[SynchroPage] - syncAll - effectives', count);
            this.sync.effectives.done = true;
            this.sync.effectives.count = count;
        });
        this.syncCollects().subscribe(count => {
            console.debug('[SynchroPage] - syncAll - collects', count);
            this.sync.collects.done = true;
            this.sync.collects.count = count;
        });
    }

    /**
     *
     * @returns {Observable<number>}
     */
    syncEvents(): Observable<number> {
        console.log('[SynchroPage] - syncEvents');
        return new Observable<number>(observer => {
            this.eventsServices.getEvents(
                this.authenticationService.meta.season.startDate,
                this.authenticationService.meta.season.endDate,
                'championship',
                this.authenticationService.meta.activity._id,
                this.authenticationService.meta._id,
            ).subscribe(eventList => {
                console.debug('[SynchroPage] - syncEvents - eventList', eventList);
                this.storage.get(this.authenticationService.meta._id + '-events').then(storedEvents => {
                    console.debug('[SynchroPage] - syncEvents - storedEvents', storedEvents);
                    let events = _.unionBy(storedEvents, eventList, '_id');
                    console.debug('[SynchroPage] - syncEvents - events', events);
                    this.storage.set(this.authenticationService.meta._id + '-events', events);
                    let missing = _.differenceBy(storedEvents, eventList, '_id');
                    console.debug('[SynchroPage] - syncEvents - missing', missing);
                    let asyncs: Observable<boolean>[] = [];
                    missing.forEach(e => {
                        asyncs.push(new Observable<boolean>(obs => {
                            this.eventsServices.addEvent(e).subscribe(r => {
                                console.debug('[SynchroPage] - syncEvents - result', r);
                                obs.next(true);
                            }, e => {
                                obs.error(e);
                            }, () => {
                                obs.complete();
                            });
                        }));
                    });
                    if (asyncs.length > 0) {
                        Observable.forkJoin(asyncs).subscribe(r => {
                            console.debug('[SynchroPage] - syncEvents - forkJoin', r);
                            observer.next(asyncs.length);
                            observer.complete();
                        });
                    } else {
                        observer.next(0);
                        observer.complete();
                    }
                });
            });
        });
    }

    /**
     *
     * @returns {Observable<number>}
     */
    syncEffective(): Observable<number> {
        return new Observable<number>(observer => {
            this.effectiveService.getList(this.authenticationService.meta._id).subscribe((effectivesFromAPI: any[]) => {
                this.storage.get('effectives').then((storedEffectives: any[]) => {
                    let effective = _.unionBy(storedEffectives, effectivesFromAPI, '_id');
                    this.storage.set('effectives', effective);
                    let missing = _.differenceBy(storedEffectives, effectivesFromAPI, '_id');
                    let asyncs: Observable<boolean>[] = [];
                    missing.forEach(e => {
                        asyncs.push(new Observable<boolean>(obs => {
                            this.effectiveService.update(e).subscribe(r => {
                                console.debug('[SynchroPage] - syncEffective - result', r);
                                obs.next(true);
                            }, e => {
                                obs.error(e);
                            }, () => {
                                obs.complete();
                            });
                        }));

                    });
                    if (asyncs.length > 0) {
                        Observable.forkJoin(asyncs).subscribe(r => {
                            console.debug('[SynchroPage] - syncEffective - forkJoin', r);
                            observer.next(asyncs.length);
                            observer.complete();
                        });
                    } else {
                        observer.next(0);
                        observer.complete();
                    }
                });
            });
        });
    }

    /**
     *
     * @returns {Observable<number>}
     */
    syncCollects(): Observable<number> {
        return new Observable<number>(observer => {
            this.collectService.getCollectList({
                sandboxId: this.authenticationService.meta._id,
                startDate: this.authenticationService.meta.season.startDate,
                endDate: this.authenticationService.meta.season.endDate
            }).subscribe((collectsFromAPI: any[]) => {
                this.storage.get(this.authenticationService.meta._id + '-collects').then((storedCollects: any[]) => {
                    let effective = _.unionBy(storedCollects, collectsFromAPI, '_id');
                    this.storage.set(this.authenticationService.meta._id + '-collects', effective);
                    let missing = _.differenceBy(storedCollects, collectsFromAPI, '_id');
                    let asyncs: Observable<boolean>[] = [];
                    missing.forEach(e => {
                        asyncs.push(new Observable<boolean>(obs => {
                            this.collectService.addCollect(e).subscribe(r => {
                                console.debug('[SynchroPage] - syncCollects - result', r);
                                obs.next(true);
                            }, e => {
                                obs.error(e);
                            }, () => {
                                obs.complete();
                            });
                        }));

                    });
                    const existing = _.intersectionBy(storedCollects, collectsFromAPI, '_id');
                    existing.forEach(e => {
                        asyncs.push(new Observable<boolean>(obs => {
                            this.collectService.updateCollect(e).subscribe(r => {
                                console.debug('[SynchroPage] - syncCollects - result', r);
                                obs.next(true);
                            }, e => {
                                obs.error(e);
                            }, () => {
                                obs.complete();
                            });
                        }));
                    });
                    if (asyncs.length > 0) {
                        Observable.forkJoin(asyncs).subscribe(r => {
                            console.debug('[SynchroPage] - syncCollects - forkJoin', r);
                            observer.next(asyncs.length);
                            observer.complete();
                        });
                    } else {
                        observer.next(0);
                        observer.complete();
                    }
                });
            });
        });
    }

    /**
     *
     * @returns {Observable<number>}
     */
    syncStats(): Observable<number> {
        return new Observable<number>(observer => {
            this.storage.get(this.authenticationService.meta._id + '-events').then(storedEvents => {
                let asyncs: Observable<number>[] = [];
                storedEvents.forEach(currentEvent => {
                    this.storage.get('stats-' + currentEvent._id).then(stats => {
                        asyncs.push(new Observable<number>(obs => {
                            this.statAPI.addBulk(stats).subscribe((r: any) => {
                                obs.next(r.count);
                            }, e => {
                                obs.error(e);
                            }, () => {
                                obs.complete();
                            });
                        }));
                    });
                });
                if (asyncs.length > 0) {
                    Observable.forkJoin(asyncs).subscribe(r => {
                        console.debug('[SynchroPage] - syncStatss - forkJoin', r);
                        observer.next(_.reduce(r, function (sum, n) {
                            return sum + n;
                        }, 0));
                        observer.complete();
                    });
                } else {
                    observer.next(0);
                    observer.complete();
                }
            });
        });
    }
}