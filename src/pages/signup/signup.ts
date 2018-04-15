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

  user: any;
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
      'login': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]],
      'passwordConfirm': ['', [Validators.required]]
    }, { validator: this.matchingPasswords('password', 'passwordConfirm') });

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
    console.log("Bouton submit")
    if (this.userForm.valid) {
      this.user.account.login = formVal.login;
      this.userService.registerUser(this.user).subscribe(r => {
      
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
