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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from "../../providers/api/api.user.service";

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
   */
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private userService: UserService) {

    this.userForm = this.formBuilder.group({
      'login': ['', Validators.compose([Validators.required, Validators.pattern(/[a-zA-Z0-9_\-]{4,}/)])],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', [Validators.required]],
      'confirmPassword': ['', [Validators.required]],
      'cgu': ['false', Validators.compose([Validators.required, Validators.requiredTrue])]
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  createAccount(formVal) {
    console.log('[SignupPage] - createAccount', formVal);
    if (this.userForm.valid) {
      let account = {login: formVal.login, passwd: formVal.password};
      let contact = {email: formVal.email};
      let plan = {levelPlan: 'FREEMIUM', activity: {_id: 'ACT-HAND'}};

      let user = {
        account: account,
        contact: contact,
        plan: plan,
      };

      // Test unicite du login
      this.userService.usernameTest(account.login).subscribe(r => {
        if (r.status === true) {
          return {
            nonUniqueLogin: true
          };
        } else {
          // Enregistrement
          this.userService.registerUser(user).subscribe(rs => {
            console.log('[SignupPage] - createAccount - registerUser', rs);
          })
        }
      })

    }
  }

  cancel() {
    this.navCtrl.pop();
  }

  isValid(field: string) {
    let formField = this.userForm.controls[field];
    return formField.valid || formField.pristine;
  }

}
