/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.
 *  Qaobee
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

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, Refresher } from 'ionic-angular';
import { AuthenticationService } from "../../../providers/authentication.service";
import { EventsService } from "../../../providers/api/api.events.service";
import { CollectService } from '../../../providers/api/api.collect.service';
import { Storage } from "@ionic/storage";
import { Utils } from "../../../providers/utils";
import { DatePipe } from "@angular/common";
import { SettingsService } from "../../../providers/settings.service";
import { EventDetailPage } from "../event-detail/event-detail";
import { EventUpsertPage } from "../event-upsert/event-upsert";
import { EventStatsPage } from "../event-stats/event-stats";
import { TeamBuildPage } from "../../collect/team-build/team-build";
import moment from 'moment';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

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
    @ViewChild(Content) content: Content;

    datePipe: DatePipe;
    eventList: any;
    eventListSize: number;
    eventListFiltred: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {EventsService} eventsServices
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {SettingsService} settingsService
     * @param {CollectService} collectService
     * @param {GoogleAnalytics} ga
     * @param {ElementRef} el
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private eventsServices: EventsService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private settingsService: SettingsService,
                private collectService: CollectService,
                private ga: GoogleAnalytics,
                private el: ElementRef) {
        this.datePipe = new DatePipe(this.settingsService.getLanguage());

    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('EventListPage');
        this.retrieveEventList();
    }

    /**
     * Filter event list
     * @param ev
     */
    searchItems(ev: any) {

        // set val to the value of the ev target
        let val = ev.target.value;
        this.eventListFiltred = [];

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {

            // Reset items back to all of the items
            this.storage.get(this.authenticationService.meta._id + '-events').then(events => {
                    for (let index = 0; index < events.length; index++) {
                        const element = events[ index ];
                        if (element.type.label.toLowerCase().indexOf(val.toLowerCase()) > -1 || element.label.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                            this.eventListFiltred.push(element);
                        }
                    }
                    this.populateEvents(this.eventListFiltred);
                    this.eventListSize = this.eventListFiltred.length;
                }
            );
        } else {
            this.retrieveEventList();
        }
    }

    /**
     * if evnets exist then return list, else, call eventsService
     */
    private retrieveEventList() {
        this.storage.get(this.authenticationService.meta._id + '-events').then(events => {
            if (!events) {
                this.getEvents(null);
            } else {
                this.populateEvents(events);
                this.eventListSize = events.length;
            }
        })
    }

    /**
     *
     * @param {Refresher} refresher
     */
    private getEvents(refresher: Refresher) {
        this.eventsServices.getEvents(
            this.authenticationService.meta.season.startDate,
            this.authenticationService.meta.season.endDate,
            undefined,
            this.authenticationService.meta.activity._id,
            this.authenticationService.meta._id,
        ).subscribe(eventList => {
            console.log('[EventListPage] - getEvents', eventList);
            this.storage.set(this.authenticationService.meta._id + '-events', eventList);
            this.populateEvents(eventList);
            if (refresher) {
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
        let scrollDate;
        console.log('[EventListPage] - populateEvents', events);
        if (events) {
            events.sort(Utils.compareEvents);
            events.forEach(e => {
                let startDateStr = this.datePipe.transform(e.startDate, 'MMMM  - yyyy');
                if (e.startDate < moment().valueOf()) {
                    scrollDate = startDateStr;
                }
                if (!this.eventList.hasOwnProperty(startDateStr)) {
                    this.eventList[ startDateStr ] = [];
                }
                this.collectService.getCollects(this.authenticationService.meta._id, e._id, e.owner.effectiveId, e.owner.teamId, moment("01/01/2000", "DD/MM/YYYY").valueOf(), moment().valueOf()).subscribe(result => {
                    if (result) {
                        e.isCollected = result[ 0 ] && result[ 0 ].status === 'done';
                    }
                    if (e) {
                        this.eventList[ startDateStr ].push(e);
                    }
                });
            });
            this.eventListSize = events.length;
            console.debug('[EventListPage] - populateEvents - scrollDate', scrollDate, moment().valueOf());
            if (scrollDate) {
                this.scrollTo(this.buildId(scrollDate));
            }
        }
    }

    /**
     *
     * @param event
     * @param clickEvent
     */
    goToViewEventStat(event: any, clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(EventStatsPage, {event: event});
    }

    /**
     *
     * @param event
     * @param clickEvent
     */
    goToStartCollect(event: any, clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(TeamBuildPage, {event: event});
    }

    /**
     *
     */
    addEvent(clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(EventUpsertPage, {editMode: 'CREATE'});
    }

    /**
     *
     * @param event
     * @param clickEvent
     */
    goToDetail(event: any, clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(EventDetailPage, {event: event});
    }

    buildId(key: string) {
        return 'area-' + key.replace(/ /g, '-');
    }

    private scrollTo(element: string) {
        window.setTimeout(() => {
            const target = document.querySelector('#' + element);
            if (target) {
                let yOffset = document.getElementById(element).offsetTop;
                this.content.scrollTo(0, yOffset, 4000)
            }
        }, 500);
    }
}
