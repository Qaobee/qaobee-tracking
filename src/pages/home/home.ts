import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.user = navParams.get('user');
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad MenuPage');
  }

}
