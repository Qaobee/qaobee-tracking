
import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from "../../providers/authentication.service";
import { PlayerListPage } from '../player-list/player-list';
import { EventListPage } from '../event-list/event-list';
import { CollectListPage } from './../collect-list/collect-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private authenticationService: AuthenticationService) {
      this.user = navParams.get('user');
      if (!this.user) {
          this.user = this.authenticationService.user;
      }
  }

  /**
     *
     */
    goToEventList() {
        
        this.navCtrl.push(EventListPage);
    }

    /**
     *
     */
    goToPlayerList() {
        
        this.navCtrl.push(PlayerListPage);
    }

    /**
     *
     */
    goToCollectList() {
        
        this.navCtrl.push(CollectListPage);
    }

  ionViewDidLoad() {
      console.log('ionViewDidLoad HomePage');
  }

}
