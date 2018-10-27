/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.
 *  Qaobee
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
import { TranslateService } from '@ngx-translate/core';
import { UserService } from "../../providers/api/api.user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { SignupEndPage } from './signupEnd';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  userForm: FormGroup;

  /**
   *
   * @param navCtrl
   * @param navParams
   * @param formBuilder
   * @param userService
   * @param {AlertController} alertCtrl
   * @param {TranslateService} translateService
   * @param {GoogleAnalytics} ga
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private alertCtrl: AlertController,
              private translateService: TranslateService,
              private ga: GoogleAnalytics) {

    this.userForm = this.formBuilder.group({
      'login': [ '', Validators.compose([ Validators.required, Validators.pattern(/[a-zA-Z0-9_\-]{4,}/) ]) ],
      'email': [ '', Validators.compose([ Validators.required, Validators.email ]) ],
      'password': [ '', Validators.compose([ Validators.required, Validators.pattern(/[a-zA-Z0-9_\-]{4,}/) ]) ],
      'confirmPassword': [ '', [ Validators.required ] ],
      'cgu': [ 'false', Validators.compose([ Validators.required, Validators.requiredTrue ]) ]
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });

  }

  /**
   *
   */
  ionViewDidEnter() {
    this.ga.trackView('SignupPage');
    this.ga.trackEvent('Signup', 'Start', 'Start', 1);
  }

  /**
   *
   * @param {string} passwordKey
   * @param {string} confirmPasswordKey
   * @returns {(group: FormGroup) => {[p: string]: any}}
   */
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [ key: string ]: any } => {
      let password = group.controls[ passwordKey ];
      let confirmPassword = group.controls[ confirmPasswordKey ];

      if(password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  /**
   *
   * @param formVal
   */
  createAccount(formVal) {
    if(this.userForm.valid) {
      let account = { login: formVal.login, passwd: formVal.password };
      let contact = { email: formVal.email };
      let plan = { levelPlan: 'FREEMIUM', activity: { _id: 'ACT-HAND' } };

      let user = {
        account: account,
        contact: contact,
        plan: plan,
      };

      // Test unicite du login
      this.userService.usernameTest(account.login).subscribe(r => {
        if(r.status === true) {
          this.translateService.get('signup.error.nonunique').subscribe(
            value => {
              this.showAlert(value);
            }
          )
        } else {
          // Enregistrement
          this.userService.registerUser(user).subscribe(rs => {
            if(rs.person !== 'null' && rs.person._id !== 'null') {
              this.navCtrl.push(SignupEndPage, {});
            }
          })
        }
      })

    }
  }

  /**
   *
   * @param {string} message
   */
  showAlert(message: string) {
    this.translateService.get([ 'actionButton.Ok', 'warning' ]).subscribe(t => {
      let alert = this.alertCtrl.create({
        title: t[ 'warning' ],
        subTitle: message,
        buttons: [ t[ 'actionButton.Ok' ] ]
      });
      alert.present();
    });

  }

  /**
   *
   */
  cancel() {
    this.navCtrl.pop();
  }

  /**
   *
   * @param {string} field
   * @returns {boolean}
   */
  isValid(field: string) {
    let formField = this.userForm.controls[ field ];
    return formField.valid || formField.pristine;
  }
}
