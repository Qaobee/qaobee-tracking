/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.  Qaobee
 *  All Rights Reserved.
 *
 *  NOTICE: All information contained here is, and remains
 *  the property of Qaobee and its suppliers,
 *  if any. The intellectual and technical concepts contained
 *  here are proprietary to Qaobee and its suppliers and may
 *  be covered by U.S. and Foreign Patents, patents in process,
 *  and are protected by trade secret or copyright law.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from Qaobee.
 */
import { PlayerDetailPage } from './../player-detail/player-detail';
import { Component } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { PersonService } from './../../../providers/api/api.person.service';
import {AuthenticationService} from "../../../providers/authentication.service";

@Component({
  selector: 'page-player-list',
  templateUrl: 'player-list.html',
})
export class PlayerListPage {

  playerList: any;

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
      this.storage.get('players').then(players => {
        if (!players) {
            this.getPlayers(null);
        } else {
          this.playerList = players;
        }
      })
    }

  /**
     *
     * @param {Refresher} refresher
     */
  doRefresh(refresher:Refresher) {
      console.log('[EventListPage] - doRefresh');
      this.getPlayers(refresher);
  }

  private getPlayers(refresher:Refresher) {
    this.personService.getListPersonSandbox(this.authenticationService.meta._id).subscribe(list => {
      this.playerList = list;
      this.storage.set('players', list);
      if(refresher) {
        refresher.complete();
    }
    });
  }

  /**
     *
     */
    goToAddPlayer() {
      this.navCtrl.push(PlayerDetailPage);
  }

    /**
     * 
     * @param player
     * @param clickEvent
     */
    goToDetail(player: any, clickEvent: any) {
      clickEvent.stopPropagation();
      this.navCtrl.push(PlayerDetailPage, {player : player});
  }

}
