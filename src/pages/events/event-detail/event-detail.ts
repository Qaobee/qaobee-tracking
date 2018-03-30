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
        console.log('[EventDetailPage] - ionViewDidLoad', this.event);
    }

    /**
     *
     */
    goToCollect() {
        console.log('[EventDetailPage] - goToCollect');
        this.navCtrl.push(TeamBuildPage, {event: this.event});
    }

    /**
     *
     */
    goToEdit() {
        console.log('[EventDetailPage] - goToEdit');
        this.navCtrl.push(EventUpsertPage, {event : this.event});
    }

    /**
     *
     */
    delete() {
        console.log('[EventDetailPage] - delete');
        // TODO
    }
}
