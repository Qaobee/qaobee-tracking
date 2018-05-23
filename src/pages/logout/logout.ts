import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthenticationService } from '../../providers/authentication.service';

@Component({
    selector: 'page-logout',
    templateUrl: 'logout.html',
})
export class LogoutPage {

    /**
     * .
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     */
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private storage: Storage,
        private authenticationService: AuthenticationService
    ) {

    }

    /**
     *
     */
    doLogout() {
        this.storage.forEach((v: any, k: string) => {
            console.debug('[LogoutPage] - doLogout', k, v);
            if (k !== 'login') {
                this.storage.remove(k);
            }
            this.authenticationService.isLogged = false;
            delete this.authenticationService.meta;
            delete this.authenticationService.token;
            delete this.authenticationService.user;
            this.navCtrl.setRoot(LoginPage, {});
        });
    }

    /**
     *
     */
    cancel() {
        this.navCtrl.pop();
    }
}