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
import {UniqueDeviceID} from '@ionic-native/unique-device-id';

import {UserService} from '../../providers/api/api.user.service';
import {SignupPage} from '../signup/signup';
import {Storage} from '@ionic/storage';
import {MessageBus} from "../../providers/message-bus.service";

/**
 * LoginPage page.
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    public login: string;
    public passwd: string;

    /**
     * .
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {UserService} userService
     * @param {Storage} storage
     * @param {UniqueDeviceID} uniqueDeviceID
     * @param {MessageBus} eventService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private userService: UserService,
                private storage: Storage,
                private uniqueDeviceID: UniqueDeviceID,
                private eventService: MessageBus) {
        this.storage.get("login").then(l => {
            this.login = l;
        })
    }

    /** */
    doLogin() {
        this.uniqueDeviceID.get().then((uuid: any) => {
            console.log('[LoginPage] - doLogin - uuid', uuid);
            this.submitLogin(uuid);
        }).catch((error: any) => {
            console.error('[LoginPage] - doLogin - error',error);
            this.submitLogin("123456-" + this.login);
        });
    }

    /** */
    goToSignup() {
        this.navCtrl.push(SignupPage, {});
    }

    submitLogin(uuid: string) {
        this.userService.login(this.login, this.passwd, uuid).subscribe((result: any) => {
            if (result) {
                this.storage.set("mobileToken", uuid);
                this.eventService.broadcast(MessageBus.userLogged, result);
            }
        });
    }
}
