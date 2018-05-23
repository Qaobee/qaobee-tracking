import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { PersonService } from '../../../providers/api/api.person.service';
import { PlayerUpsertPage } from '../player-upsert/player-upsert';
import { PlayerStatsPage } from '../player-stats/player-stats';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'page-player-detail',
    templateUrl: 'player-detail.html',
})
export class PlayerDetailPage {

    player: any;

    /**
     *
     * @param navCtrl
     * @param navParams
     * @param personService
     * @param alertCtrl
     * @param translateService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private personService: PersonService,
                private alertCtrl: AlertController,
                private translateService: TranslateService) {
        this.player = navParams.get('player');
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
