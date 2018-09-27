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

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventsService } from "../../providers/api/api.events.service";
import { AuthenticationService } from "../../providers/authentication.service";
import { Storage } from "@ionic/storage";
import { Utils } from "../../providers/utils";
import { EventUpsertPage } from "../../pages/events/event-upsert/event-upsert";
import { EventListPage } from '../../pages/events/event-list/event-list';
import { TeamBuildPage } from "../../pages/collect/team-build/team-build";

@Component({
    selector: 'next-event',
    templateUrl: 'next-event.html'
})
export class NextEventComponent {

    user: any;
    nextEvent: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {EventsService} eventsServices
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     */
    constructor(public navCtrl: NavController,
                private eventsServices: EventsService,
                private storage: Storage,
                private authenticationService: AuthenticationService) {

        this.user = this.authenticationService.user;
        this.storage.get(this.authenticationService.meta._id+'-events').then(events => {
            if (!events) {
                this.eventsServices.getEvents(
                    this.authenticationService.meta.season.startDate,
                    this.authenticationService.meta.season.endDate,
                    'championship',
                    this.authenticationService.meta.activity._id,
                    this.authenticationService.meta._id,
                ).subscribe(eventList => {
                    this.storage.set(this.authenticationService.meta._id+'-events', eventList).then(r => {
                        console.log('[NextEventComponent] constructor', r);
                    });
                    this.getLastEvent(eventList);
                });
            } else {
                this.getLastEvent(events);
            }
        });
    }

    /**
     *
     * @param eventList
     */
    private getLastEvent(eventList: any) {
        let events = eventList.sort(Utils.compareEvents);

        if (events.length > 0) {
            for (let index = 0; index < events.length; index++) {
                let valA = events[ index ].startDate || 0;
                let valB = new Date().getTime() || 0;
                if (valA > valB) {
                    this.nextEvent = events[ index ];
                    break
                }
            }


        }
    }

    /**
     *
     * @param event
     */
    goToStartCollect(event: any) {
        this.navCtrl.push(TeamBuildPage, {event: event});
    }

    /**
     *
     */
    goToCreateEvent() {
        this.navCtrl.push(EventUpsertPage, {event: null, editMode : 'CREATE'});
    }

    /**
     *
     * @param event
     * @param clickEvent
     */
    goToEventList() {
        this.navCtrl.push(EventListPage);
    }
}
