import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventsService } from "../../providers/api/api.events.service";
import { AuthenticationService } from "../../providers/authentication.service";
import { Storage } from "@ionic/storage";
import { Utils } from "../../providers/utils";
import { MessageBus } from "../../providers/message-bus.service";
import { EventUpsertPage } from "../../pages/events/event-upsert/event-upsert";
import { EventDetailPage } from '../../pages/events/event-detail/event-detail';
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
     * @param {MessageBus} eventService
     */
    constructor(public navCtrl: NavController,
                private eventsServices: EventsService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private eventService: MessageBus) {

        this.user = this.authenticationService.user;
        this.storage.get('events').then(events => {
            if (!events) {
                this.eventsServices.getEvents(
                    this.authenticationService.meta.season.startDate,
                    this.authenticationService.meta.season.endDate,
                    'championship',
                    this.authenticationService.meta.activity._id,
                    this.authenticationService.meta._id,
                ).subscribe(eventList => {
                    this.storage.set('events', eventList).then(r => {
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
     * @param clickEvent
     */
    goToViewEventStat(event: any, clickEvent: any) {
        clickEvent.stopPropagation();
        console.log('goToViewEventStat');
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
    goToCreateEvent() {
        this.navCtrl.push(EventUpsertPage, {event: event, editMode : 'CREATE'});
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
}
