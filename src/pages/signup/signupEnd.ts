
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
import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup-end',
  templateUrl: 'signupEnd.html',
})
export class SignupEndPage {

  /**
   *
   * @param navCtrl
   * @param viewCtrl
   */
  constructor(public navCtrl: NavController,
    public  viewCtrl:ViewController) {

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupEndPage');
  }

  goToLogin() {
    this.navCtrl
        .push(LoginPage)
        .then(() => {
          // On supprime toutes les stacks des vues pour repartir dans une navigation propre
            const index = this.viewCtrl.index;
            for(let i = index; i > 0; i--){
                this.navCtrl.remove(i);
            }
        });
  }
}
