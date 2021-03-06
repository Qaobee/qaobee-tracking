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
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-welcome',
    templateUrl: 'welcome.html',
})
export class WelcomePage {

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private ga: GoogleAnalytics) {
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('WelcomePage');
    }

    /**
     *
     */
    goToLogin() {
        this.navCtrl.push(LoginPage, {});
    }

    /**
     *
     */
    goToSignup() {
        this.navCtrl.push(SignupPage, {});
    }

}
