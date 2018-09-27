import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthenticationService } from "../../providers/authentication.service";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";
import { SettingsService } from "../../providers/settings.service";
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    settings: {
        periodDuration: number,
        nbMaxPlayers: number,
        nbMinPlayers: number,
        nbPeriod: number,
        nbTimeout: number,
        timeoutDuration: number,
        yellowCardMax: number,
        exclusionTempo: number,
        halfTimeDuration: number
    };

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AuthenticationService} authenticationService
     * @param {TranslateService} translateService
     * @param {Storage} storage
     * @param {ToastController} toastCtrl
     * @param {SettingsService} settingsService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController, public navParams: NavParams,
                private authenticationService: AuthenticationService,
                private translateService: TranslateService,
                private storage: Storage,
                private toastCtrl: ToastController,
                private settingsService: SettingsService,
                private ga: GoogleAnalytics) {
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('SettingsPage');
        this.settingsService.getParametersGame().subscribe(s => {
            this.settings = s;
            this.settings.periodDuration = this.settings.periodDuration/60;
        });
    }

    /**
     * Save preferences
     */
    save() {
        this.settings.periodDuration = this.settings.periodDuration/60;
        this.settingsService.setParametersGame(this.settings);
        this.translateService.get("settings.saved").subscribe(t=> {
            this.presentToast(t);
        });
    }

    /**
     * Reset the showcase
     */
    resetTour() {
        this.storage.set(this.authenticationService.meta._id + "-tour-collect", false);
        this.storage.set(this.authenticationService.meta._id + "-tour-home", false);
        this.storage.set(this.authenticationService.meta._id + "-tour-team-build", false);
        this.translateService.get("settings.tour_reseted").subscribe(t=> {
            this.presentToast(t);
        });
    }

    /**
     *
     * @param msg
     */
    private presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }

}
