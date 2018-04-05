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
import {Component} from '@angular/core';
import {NavController, NavParams, Refresher} from 'ionic-angular';
import {AuthenticationService} from "../../../providers/authentication.service";
import {EventsService} from "../../../providers/api/api.events.service";
import {Storage} from "@ionic/storage";
import {Utils} from "../../../providers/utils";
import {DatePipe} from "@angular/common";
import {SettingsService} from "../../../providers/settings.service";
import {EventDetailPage} from "../event-detail/event-detail";
import {EventUpsertPage} from "../event-upsert/event-upsert";

/**
 * Generated class for the EventListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-event-list',
    templateUrl: 'event-list.html',
})
export class EventListPage {
    datePipe: DatePipe;
    eventList: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {EventsService} eventsServices
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {SettingsService} settingsService
     * @param {Utils} utils
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private eventsServices: EventsService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private settingsService: SettingsService,
                private utils: Utils) {
        this.datePipe = new DatePipe(this.settingsService.getLanguage());

    }

    /**
     *
     */
    ionViewDidLoad() {
        console.log('[EventListPage] - ionViewDidLoad');
        if(this.navParams.get('refresh')) {
            this.getEvents(null);
        } else {
            this.storage.get('events').then(events => {
                console.log('[EventListPage] - ionViewDidLoad - events in storage', events);
                if (!events) {
                    this.getEvents(null);
                } else {
                    this.populateEvents(events);
                }
            });
        }
    }

    /**
     *
     * @param refresher
     */
    doRefresh(refresher:Refresher) {
        console.log('[EventListPage] - doRefresh');
        this.getEvents(refresher);
    }

    /**
     *
     * @param {Refresher} refresher
     */
    private getEvents(refresher:Refresher) {
        this.eventsServices.getEvents(
            this.authenticationService.meta.season.startDate,
            this.authenticationService.meta.season.endDate,
            'championship',
            this.authenticationService.meta.activity._id,
            this.authenticationService.meta._id,
        ).subscribe(eventList => {
            console.log('[EventListPage] - getEvents - this.eventsServices.getEvents', eventList);
            this.storage.set('events', eventList);
            this.populateEvents(eventList);
            if(refresher) {
                refresher.complete();
            }
        });
    }

    /**
     *
     * @param {any[]} events
     */
    private populateEvents(events: any[]) {
        this.eventList = {};
        console.log('[EventListPage] - populateEvents - events', events);
        events.sort(this.utils.compareEvents);
        events.forEach(e => {
            let startDateStr = this.datePipe.transform(e.startDate, 'MMMM  - yyyy');
            if (!this.eventList.hasOwnProperty(startDateStr)) {
                this.eventList[startDateStr] = [];
            }
            this.eventList[startDateStr].push(e);
        });
        console.log('[EventListPage] - populateEvents - eventList', this.eventList);
    }

    /**
     *
     * @param event
     * @param clickEvent
     */
    goToCollect(event: any, clickEvent: any) {
        console.log('[EventListPage] - goToCollect');
        clickEvent.stopPropagation();
        // TODO
    }

    /**
     *
     */
    addEvent() {
        this.navCtrl.push(EventUpsertPage, {editMode: 'CREATE'});
    }

    /**
     *
     * @param event
     * @param clickEvent
     */
    goToDetail(event: any, clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(EventDetailPage, {event : event});
    }

}
