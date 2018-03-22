import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {EventsService} from "../../providers/api/events.service";
import {AuthenticationService} from "../../providers/authentication.service";
import {Storage} from "@ionic/storage";
import {Utils} from "../../providers/utils";

declare var google;

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
export class NextEventComponent  implements AfterViewInit {

    @ViewChild('mapelement', { read: ElementRef })
    mapelement: ElementRef;

    user: any;
    nextEvent: any;

    constructor(private eventsServices: EventsService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private utils: Utils) {
    }

    ngAfterViewInit(): void {
        this.user = this.authenticationService.user;
        console.log(this.mapelement, document.getElementById("map"))
        this.storage.get('events').then(events => {
            console.log(events);
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
        })
    }

    private getLastEvent(eventList: any) {
        let events = eventList.sort(this.utils.compareEvents);
        if(events.length > 0) {
            this.nextEvent = events[0];
            this.loadMap();
        }
    }
    loadMap() {
        let address = this.user.address;
        console.log(this.mapelement)
       /* let map = new google.maps.Map(this.mapelement.nativeElement, {
            zoom: 4,
            center: {lat: address.lat, lng: address.lng }
        });
        let marker = new google.maps.Marker({
            position: {lat: address.lat, lng: address.lng },
            map: map
        });*/
    }
}
