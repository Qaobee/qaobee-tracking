import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-signup-end',
    templateUrl: 'signupEnd.html',
})
export class SignupEndPage {

    /**
     *
     * @param {NavController} navCtrl
     * @param {ViewController} viewCtrl
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public  viewCtrl: ViewController,
                private ga: GoogleAnalytics) {

    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('SignupEndPage');
    }

    /**
     *
     */
    goToLogin() {
        this.navCtrl
            .push(LoginPage)
            .then(() => {
                // On supprime toutes les stacks des vues pour repartir dans une navigation propre
                const index = this.viewCtrl.index;
                for (let i = index; i > 0; i--) {
                    this.navCtrl.remove(i);
                }
            });
    }
}
