import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthenticationService } from '../../providers/authentication.service';
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { MessageBus } from "../../providers/message-bus.service";

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
     * @param {GoogleAnalytics} ga
     * @param {MessageBus} eventService
     */
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private storage: Storage,
        private authenticationService: AuthenticationService,
        private ga: GoogleAnalytics,
        private eventService: MessageBus
    ) {

    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('LogoutPage');
    }

    /**
     *
     */
    doLogout() {
        this.storage.forEach((v: any, k: string) => {
            console.debug('[LogoutPage] - doLogout', k, v);
            if (k !== 'login' && !k.endsWith('tour-home') && !k.endsWith('tour-collect') && !k.endsWith('tour-team-build')) {
                this.storage.remove(k);
            }
            this.authenticationService.isLogged = false;
            delete this.authenticationService.meta;
            delete this.authenticationService.token;
            delete this.authenticationService.user;
            this.ga.setUserId(null);
            this.eventService.broadcast(MessageBus.userLoggout, {});
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