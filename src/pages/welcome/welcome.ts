import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';

@Component({
    selector: 'page-welcome',
    templateUrl: 'welcome.html',
})
export class WelcomePage {

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
        console.log('ionViewDidLoad WelcomePage');
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
