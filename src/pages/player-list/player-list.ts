import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { PersonService } from './../../providers/api/api.person.service';
import {AuthenticationService} from "../../providers/authentication.service";

/**
 * Generated class for the PlayerListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
          this.personService.getListPersonSandbox(this.authenticationService.meta._id).subscribe(list => {
            console.log('load',list);
            this.playerList = list;
            this.storage.set('players', list);
          });
      } else {
        this.playerList = players;
      }
    })
  }

  refreshPlayerList() {
    this.personService.getListPersonSandbox(this.authenticationService.meta._id).subscribe(list => {
      console.log('refresh',list);
      this.playerList = list;
      this.storage.set('players', list);
    });
  }

}
