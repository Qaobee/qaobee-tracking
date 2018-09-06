import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { PersonService } from '../../../providers/api/api.person.service';
import { PlayerUpsertPage } from '../player-upsert/player-upsert';
import { PlayerStatsPage } from '../player-stats/player-stats';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { Storage } from "@ionic/storage";
import { AuthenticationService } from "../../../providers/authentication.service";

@Component({
    selector: 'page-player-detail',
    templateUrl: 'player-detail.html',
})
export class PlayerDetailPage {

    player: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {PersonService} personService
     * @param {AlertController} alertCtrl
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {TranslateService} translateService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private personService: PersonService,
                private alertCtrl: AlertController,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private translateService: TranslateService,
                private ga: GoogleAnalytics) {
        this.player = navParams.get('player');
        console.debug('[PlayerDetailPage] - constructor', this.player);
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('PlayerDetailPage');
    }

    /**
     *
     */
    editPlayer() {
        this.navCtrl.push(PlayerUpsertPage, {editMode: 'UPDATE', player: this.player});
    }

    /**
     *
     * @param {string} confirmLabels
     * @param {string} desactived
     */
    desactivatePlayer(confirmLabels: string, desactived: string) {
        this.translateService.get(confirmLabels).subscribe(
            value => {
                let alert = this.alertCtrl.create({
                    title: value.title,
                    message: value.message,
                    buttons: [
                        {
                            text: value.buttonLabelCancel,
                            role: 'cancel',
                            handler: () => {
                            }
                        },
                        {
                            text: value.buttonLabelConfirm,
                            handler: () => {
                                this.player.desactivated = desactived;
                                this.personService.updatePerson(this.player).subscribe(person => {
                                    console.debug('[PlayerDetailPage] - desactivatePlayer - updatePerson', person);
                                });
                                // update local cache
                                this.storage.get(this.authenticationService.meta._id + '-players').then(players => {
                                    if (players) {
                                        const index = players.findIndex((p) => {
                                            return p._id === this.player._id;
                                        });
                                        if(index >= 0) {
                                            players[index] = this.player;
                                            this.storage.set(this.authenticationService.meta._id + '-players', players);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
                alert.present();
            }
        )
    }

    /**
     *
     */
    goToStats() {
        this.navCtrl.push(PlayerStatsPage, {player: this.player});
    }

}
