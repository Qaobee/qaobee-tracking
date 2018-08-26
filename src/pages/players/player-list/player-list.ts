import { PlayerDetailPage } from '../player-detail/player-detail';
import { PlayerUpsertPage } from '../player-upsert/player-upsert';
import { Component } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { PersonService } from '../../../providers/api/api.person.service';
import { AuthenticationService } from "../../../providers/authentication.service";
import { PlayerStatsPage } from '../player-stats/player-stats';

@Component({
    selector: 'page-player-list',
    templateUrl: 'player-list.html',
})
export class PlayerListPage {

    playerList: any;
    playerListSize: number;
    playerListFiltred: any;

    /**
     * .
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Storage} storage
     * @param {PersonService} personService
     * @param {AuthenticationService} authenticationService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: Storage,
                private personService: PersonService,
                private authenticationService: AuthenticationService) {
        this.retrievePlayerList();
    }

    /**
     * call personneService for retrieve player list from database
     * @param refresher
     */
    private getPlayers(refresher: Refresher) {
        this.personService.getListPersonSandbox(this.authenticationService.meta._id).subscribe(list => {
            this.playerList = list;
            this.playerListSize = this.playerList.length;
            this.storage.set(this.authenticationService.meta._id+'-players', list);
            if (refresher) {
                refresher.complete();
            }
        });
    }

    /**
     * if players exist then return list, else, call personneService
     */
    private retrievePlayerList() {
        this.storage.get(this.authenticationService.meta._id+'-players').then(players => {
            if (!players) {
                this.getPlayers(null);
            } else {
                this.playerList = players;
                this.playerListSize = players.length;
            }
        })
    }

    /**
     * Filter player list
     * @param ev
     */
    searchItems(ev: any) {

        // set val to the value of the ev target
        let val = ev.target.value;
        this.playerListFiltred = [];

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {

            // Reset items back to all of the items
            this.storage.get(this.authenticationService.meta._id+'-players').then(players => {
                    for (let index = 0; index < players.length; index++) {
                        const element = players[ index ];
                        if (element.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || element.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                            this.playerListFiltred.push(element);
                        }
                    }
                    this.playerList = this.playerListFiltred;
                    this.playerListSize = this.playerListFiltred.length;
                }
            );
        } else {
            this.retrievePlayerList();
        }
    }

    /**
     *
     */
    goToAddPlayer() {
        this.navCtrl.push(PlayerUpsertPage, {editMode: 'CREATE'});
    }

    /**
     *
     * @param player
     * @param clickEvent
     */
    goToDetail(player: any, clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(PlayerDetailPage, {player: player});
    }

    /**
     *
     */
    goToStats(player: any, clickEvent: any) {
        clickEvent.stopPropagation();
        this.navCtrl.push(PlayerStatsPage, {player: player});
    }

}
