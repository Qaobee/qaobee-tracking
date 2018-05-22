import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventsService } from '../../providers/api/api.events.service';
import { AuthenticationService } from '../../providers/authentication.service';
import { EffectiveService } from '../../providers/api/api.effective.service';
import { CollectService } from '../../providers/api/api.collect.service';
import _ from "lodash";


// TODO : i18n
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
        }
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private storage: Storage,
        private eventsServices: EventsService,
        private collectService: CollectService,
        private effectiveService: EffectiveService,
        private authenticationService: AuthenticationService
    ) {
    }


    syncAll() {
        console.debug('[SynchroPage] - syncAll');
        this.syncEvents().subscribe(count => {
            console.debug('[SynchroPage] - syncAll - events', count);
            this.sync.events.done = true;
            this.sync.events.count = count;
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

    syncEvents(): Observable<Number> {
        console.log('[SynchroPage] - syncEvents');
        return new Observable<Number>(observer => {
            this.eventsServices.getEvents(
                this.authenticationService.meta.season.startDate,
                this.authenticationService.meta.season.endDate,
                'championship',
                this.authenticationService.meta.activity._id,
                this.authenticationService.meta._id,
            ).subscribe(eventList => {
                console.debug('[SynchroPage] - syncEvents - eventList', eventList);
                this.storage.get('events').then(storedEvents => {
                    console.debug('[SynchroPage] - syncEvents - storedEvents', storedEvents);
                    let events = _.unionBy(storedEvents, eventList, '_id');
                    console.debug('[SynchroPage] - syncEvents - events', events);
                    this.storage.set('events', events);
                    let missing = _.differenceBy(storedEvents, eventList, '_id');
                    console.debug('[SynchroPage] - syncEvents - missing', missing);
                    let asyncs: Observable<boolean>[] = [];
                    missing.forEach(e => {
                        asyncs.push(new Observable<boolean>(obs => {
                            this.eventsServices.addEvent(e).subscribe(r => {
                                obs.next(true);
                            }, e => {
                                obs.error(e);
                            }, () => {
                                obs.complete();
                            });
                        }));

                    });
                    if (missing.length > 0) {
                        Observable.forkJoin(asyncs).subscribe(r => {
                            console.debug('[SynchroPage] - syncEvents - forkJoin', r);
                            observer.next(missing.length);
                            observer.complete();
                        });
                    } else {
                        observer.next(missing.length);
                        observer.complete();
                    }
                });
            });
        });
    }

    syncEffective(): Observable<Number> {
        return new Observable<Number>(observer => {
            this.effectiveService.getList(this.authenticationService.meta._id).subscribe((effectivesFromAPI: any[]) => {
                this.storage.get('effectives').then((storedEffectives: any[]) => {
                    let effective = _.unionBy(storedEffectives, effectivesFromAPI, '_id');
                    this.storage.set('effectives', effective);
                    let missing = _.differenceBy(storedEffectives, effectivesFromAPI, '_id');
                    let asyncs: Observable<boolean>[] = [];
                    missing.forEach(e => {
                        asyncs.push(new Observable<boolean>(obs => {
                            this.effectiveService.update(e).subscribe(r => {
                                obs.next(true);
                            }, e => {
                                obs.error(e);
                            }, () => {
                                obs.complete();
                            });
                        }));

                    });
                    if (missing.length > 0) {
                        Observable.forkJoin(asyncs).subscribe(r => {
                            console.debug('[SynchroPage] - syncEffective - forkJoin', r);
                            observer.next(missing.length);
                            observer.complete();
                        });
                    } else {
                        observer.next(missing.length);
                        observer.complete();
                    }
                });
            });
        });
    }

    syncCollects(): Observable<Number> {
        return new Observable<Number>(observer => {
            this.collectService.getCollectList({
                sandboxId: this.authenticationService.meta._id,
                startDate: this.authenticationService.meta.season.startDate,
                endDate: this.authenticationService.meta.season.endDate
            }).subscribe((collectsFromAPI: any[]) => {
                this.storage.get('collects').then((storedCollects: any[]) => {
                    let effective = _.unionBy(storedCollects, collectsFromAPI, '_id');
                    this.storage.set('collects', effective);
                    let missing = _.differenceBy(storedCollects, collectsFromAPI, '_id');
                    let asyncs: Observable<boolean>[] = [];
                    missing.forEach(e => {
                        asyncs.push(new Observable<boolean>(obs => {
                            this.effectiveService.update(e).subscribe(r => {
                                obs.next(true);
                            }, e => {
                                obs.error(e);
                            }, () => {
                                obs.complete();
                            });
                        }));

                    });
                    if (missing.length > 0) {
                        Observable.forkJoin(asyncs).subscribe(r => {
                            console.debug('[SynchroPage] - syncCollects - forkJoin', r);
                            observer.next(missing.length);
                            observer.complete();
                        });
                    } else {
                        observer.next(missing.length);
                        observer.complete();
                    }
                });
            });
        });
    }
}