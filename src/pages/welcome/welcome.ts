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
