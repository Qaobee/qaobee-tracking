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
import {NavController, NavParams} from 'ionic-angular';
import {EventUpsertPage} from "../event-upsert/event-upsert";
import {TeamBuildPage} from "../../collect/team-build/team-build";
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker
   } from '@ionic-native/google-maps';

/**
 * Generated class for the EventListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-event-detail',
    templateUrl: 'event-detail.html',
})
export class EventDetailPage {
    event: any;
    map: GoogleMap;

    /**
     *
     * @param navCtrl
     * @param navParams
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams) {
        this.event = navParams.get('event');
    }

    /**
     *
     */
    ionViewDidLoad() {
        this.loadMap();
    }

    loadMap() {

    let mapOptions: GoogleMapOptions = {
        camera: {
        target: {
            lat: 43.0741904,
            lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
        }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
                lat: 43.0741904,
                lng: -89.3809802
            }
            })
            .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(() => {
                alert('clicked');
                });
            });

        });
    }

    /**
     *
     * @param event
     * @param clickEvent
     */
    goToviewEventStat(event: any, clickEvent: any) {
        clickEvent.stopPropagation();
        console.log('goToviewEventStat');
    }

    /**
     *
     * @param event
     * @param clickEvent
     */
    goToStartCollect(event: any, clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(TeamBuildPage, {event: this.event});
    }

    /**
     *
     */
    goToEdit() {
        console.log('[EventDetailPage] - goToEdit');
        this.navCtrl.push(EventUpsertPage, {event : this.event, editMode: 'UPDATE'});
    }

    /**
     *
     */
    delete() {
        console.log('[EventDetailPage] - delete');
        // TODO
    }
}
