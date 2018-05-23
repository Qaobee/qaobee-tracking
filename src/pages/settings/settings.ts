import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     */
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    /**
     *
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingsPage');
    }

}
