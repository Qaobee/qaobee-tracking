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
import {AuthenticationService} from "../../providers/authentication.service";
import {PlayerListPage} from '../players/player-list/player-list';
import {EventListPage} from '../events/event-list/event-list';
import {CollectListPage} from "../collect-list/collect-list";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    user: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AuthenticationService} authenticationService
     */
    constructor(public navCtrl: NavController, public navParams: NavParams,
                private authenticationService: AuthenticationService) {
        this.user = navParams.get('user');
        if (!this.user) {
            this.user = this.authenticationService.user;
        }
    }

    /**
     *
     */
    goToEventList() {
        this.navCtrl.push(EventListPage);
    }

    /**
     *
     */
    goToPlayerList() {
        this.navCtrl.push(PlayerListPage);
    }

    /**
     *
     */
    goToCollectList() {
        this.navCtrl.push(CollectListPage);
    }
}
