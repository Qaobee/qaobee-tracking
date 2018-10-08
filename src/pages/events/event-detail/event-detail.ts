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
import { AlertController, NavController, NavParams, ToastController } from 'ionic-angular';
import { EventUpsertPage } from "../event-upsert/event-upsert";
import { TeamBuildPage } from "../../collect/team-build/team-build";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { EventsService } from "../../../providers/api/api.events.service";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";
import { AuthenticationService } from "../../../providers/authentication.service";

/**
 * Generated class for the EventListPage page.
 */
@Component({
    selector: 'page-event-detail',
    templateUrl: 'event-detail.html',
})
export class EventDetailPage {
    event: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {GoogleAnalytics} ga
     * @param {AlertController} alertCtrl
     * @param {TranslateService} translateService
     * @param {ToastController} toastCtrl
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {EventsService} eventsServices
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private ga: GoogleAnalytics,
                private alertCtrl: AlertController,
                private translateService: TranslateService,
                private toastCtrl: ToastController,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private eventsServices: EventsService) {
        this.event = navParams.get('event');
    }


    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('EventDetailPage');
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
        this.navCtrl.push(EventUpsertPage, {event: this.event, editMode: 'UPDATE'});
    }

    /**
     *
     */
    delete() {
        console.log('[EventDetailPage] - delete');
        this.translateService.get([ 'eventsModule', 'actionButton' ]).subscribe(t => {
            const alert = this.alertCtrl.create({
                title: t[ 'eventsModule' ].confirmDelete.title,
                message: t[ 'eventsModule' ].confirmDelete.message,
                buttons: [ {
                    text: t[ 'actionButton' ][ 'Cancel' ],
                    role: 'cancel',
                    handler: () => {
                    }
                }, {
                    text: t[ 'actionButton' ][ 'Ok' ],
                    handler: () => {
                        this.eventsServices.deleteEvent(this.event._id).subscribe(res => {
                            console.log('[EventDetailPage] - delete', res);
                            this.eventsServices.getEvents(
                                this.authenticationService.meta.season.startDate,
                                this.authenticationService.meta.season.endDate,
                                undefined,
                                this.authenticationService.meta.activity._id,
                                this.authenticationService.meta._id,
                            ).subscribe(eventList => {
                                this.storage.set(this.authenticationService.meta._id + '-events', eventList);
                                this.presentToast(t[ 'eventsModule' ].messages.deleteDone);
                                if (this.navCtrl.canGoBack()) {
                                    this.navCtrl.pop();
                                }
                            });
                        });
                    }
                } ]
            });
            alert.present();
        });
    }

    /**
     *
     * @param msg
     */
    private presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }
}
