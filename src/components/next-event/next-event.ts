import {Component} from '@angular/core';
import {EventsService} from "../../providers/api/api.events.service";
import {AuthenticationService} from "../../providers/authentication.service";
import {Storage} from "@ionic/storage";
import {Utils} from "../../providers/utils";
import { compareDates } from 'ionic-angular/util/datetime-util';

/**
 * Generated class for the NextEventComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'next-event',
    templateUrl: 'next-event.html' 
})
export class NextEventComponent {

    user: any;
    nextEvent: any;

    constructor(private eventsServices: EventsService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private utils: Utils) {

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
                    console.log(eventList);
                    this.storage.set('events', eventList);
                    this.getLastEvent(eventList);
                });
            } else {
                this.getLastEvent(events);
            }
        });
    }

    private getLastEvent(eventList: any) {
        let events = eventList.sort(this.utils.compareEvents);
        
        if(events.length > 0) {
            let valA = events[0].startDate || 0;
            let valB = new Date() || 0;
            if (valA > valB) {
                this.nextEvent = events[0];
            }
        }
    }

    goToCreateEvent() {
        console.log('create event');
    }

    goToViewEvent() {
        console.log('create event');
    }
}
