import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from "../../providers/api/api.user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SignupEndPage } from './signupEnd';

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
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private formBuilder: FormBuilder,
                private userService: UserService,
                private alertCtrl: AlertController,
                private translateService: TranslateService) {

        this.userForm = this.formBuilder.group({
            'login': [ '', Validators.compose([ Validators.required, Validators.pattern(/[a-zA-Z0-9_\-]{4,}/) ]) ],
            'email': [ '', Validators.compose([ Validators.required, Validators.email ]) ],
            'password': [ '', Validators.compose([ Validators.required, Validators.pattern(/[a-zA-Z0-9_\-]{4,}/) ]) ],
            'confirmPassword': [ '', [ Validators.required ] ],
            'cgu': [ 'false', Validators.compose([ Validators.required, Validators.requiredTrue ]) ]
        }, {validator: this.matchingPasswords('password', 'confirmPassword')});

    }

    /**
     *
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad SignupPage');
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

            if (password.value !== confirmPassword.value) {
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
                    this.translateService.get('signup.messages.loginAlreadyExists').subscribe(
                        value => {
                            this.showAlert(value);
                        }
                    )
                } else {
                    // Enregistrement
                    this.userService.registerUser(user).subscribe(rs => {
                        if (rs.person !== 'null' && rs.person._id !== 'null') {
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
        let okButton = '';
        this.translateService.get('signup.messages.alert.button.ok').subscribe(
            value => {
                okButton = value;
            }
        );
        let errorTitle = '';
        this.translateService.get('signup.messages.alert.title').subscribe(
            value => {
                errorTitle = value;
            }
        );

        let alert = this.alertCtrl.create({
            title: errorTitle,
            subTitle: message,
            buttons: [ okButton ]
        });
        alert.present();
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
