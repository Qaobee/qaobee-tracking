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

import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, Refresher } from 'ionic-angular';
import { DatePipe } from "@angular/common";
import { EventsService } from "../../../providers/api/api.events.service";
import { Storage } from "@ionic/storage";
import { AuthenticationService } from "../../../providers/authentication.service";
import { SettingsService } from "../../../providers/settings.service";
import { CollectService } from "../../../providers/api/api.collect.service";
import moment from "moment";
import { EventStatsPage } from "../../events/event-stats/event-stats";
import { EventDetailPage } from "../../events/event-detail/event-detail";
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-collect-list',
    templateUrl: 'collect-list.html',
})
export class CollectListPage {
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
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private eventsServices: EventsService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private settingsService: SettingsService,
                private collectService: CollectService,
                private ga: GoogleAnalytics) {
        this.datePipe = new DatePipe(this.settingsService.getLanguage());

    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('CollectListPage');
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
                        if (element && element.type && (element.type.label.toLowerCase().indexOf(val.toLowerCase()) > -1 || element.label.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
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
            this.authenticationService.statStartDate,
            Date.now(),
            undefined,
            this.authenticationService.meta.activity._id,
            this.authenticationService.meta._id,
        ).subscribe(eventList => {
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
        if (events) {
            console.debug('[CollectListPage] - populateEvents', events);
            events.forEach(e => {
                const startDateStr = this.datePipe.transform(e.startDate, 'MMMM  - yyyy');
                if(e.startDate < moment().valueOf()) {
                    scrollDate = startDateStr;
                }
                if (!this.eventList.hasOwnProperty(startDateStr)) {
                    this.eventList[ startDateStr ] = [];
                }

                this.collectService.getCollects(this.authenticationService.meta._id, e._id, e.owner.effectiveId, e.owner.teamId, moment("01/01/2000", "DD/MM/YYYY").valueOf(), moment().valueOf()).subscribe(result => {
                    e.isCollected = result[ 0 ] && result[ 0 ].status === 'done';
                    if (e.isCollected) {
                        this.eventList[ startDateStr ].push(e);
                    }
                });
            });
            this.eventListSize = events.length;
            console.debug('[CollectListPage] - populateEvents - scrollDate', scrollDate, moment().valueOf());
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
