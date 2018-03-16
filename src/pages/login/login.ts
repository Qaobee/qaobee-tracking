import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {UserService} from '../../services/userService';
import { SignupPage } from '../signup/signup';

/**
 * LoginPage page.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private login:string;
  private passwd:string;

  /**
   * 
   * @param navCtrl 
   * @param navParams 
   * @param userService 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
  }

  /** */
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  /** */
  doLogin() {
    this.userService.login(this.login, this.passwd).subscribe(result => {
      if(result) {
        console.log(result);
      }
    });
  }

  /** */
  goToSignup() {
    this.navCtrl.push(SignupPage, {});
  }

}
