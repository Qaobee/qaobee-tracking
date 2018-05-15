import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * LoginPage page.
 */
@Component({
    selector: 'page-logout',
    templateUrl: 'logout.html',
})
export class LogoutPage {

    /**
         * .
         * @param {NavController} navCtrl
         * @param {NavParams} navParams
         */
    constructor(public navCtrl: NavController,
        public navParams: NavParams) {

    }

    doLogout() {

    }
}