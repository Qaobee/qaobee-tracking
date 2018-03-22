import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from "../../providers/authentication.service";

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

  ionViewDidLoad() {
      console.log('ionViewDidLoad HomePage');
  }

}
