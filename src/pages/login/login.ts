import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ToastController } from 'ionic-angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Storage } from '@ionic/storage';

import { SignupPage } from '../signup/signup';
import { MessageBus } from "../../providers/message-bus.service";
import { UserService } from '../../providers/api/api.user.service';
import { TranslateService } from "@ngx-translate/core";

/**
 * LoginPage page.
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    public login: string;
    public passwd: string;

    /**
     * .
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AlertController} alertController
     * @param {UserService} userService
     * @param {Storage} storage
     * @param {ToastController} toastController
     * @param {UniqueDeviceID} uniqueDeviceID
     * @param {TranslateService} translateService
     * @param {MessageBus} eventService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertController: AlertController,
                private userService: UserService,
                private storage: Storage,
                private toastCtrl: ToastController,
                private uniqueDeviceID: UniqueDeviceID,
                private translateService: TranslateService,
                private eventService: MessageBus) {
        this.storage.get('login').then(l => {
            this.login = l;
        })
    }

    /**
     *
     */
    doLogin() {
        this.uniqueDeviceID.get().then((uuid: any) => {
            console.log('[LoginPage] - doLogin - uuid', uuid);
            this.submitLogin(uuid);
        }).catch((error: any) => {
            console.error('[LoginPage] - doLogin - error', error);
            this.submitLogin("123456-" + this.login);
        });
    }

    /**
     *
     */
    goToSignup() {
        this.navCtrl.push(SignupPage, {});
    }

    /**
     *
     * @param {string} uuid
     */
    submitLogin(uuid: string) {
        this.userService.login(this.login, this.passwd, uuid).subscribe((result: any) => {
            if (result) {
                this.storage.set("mobileToken", uuid);
                this.eventService.broadcast(MessageBus.userLogged, result);
            }
        });
    }

    doPasswordReset() {
        this.translateService.get([ 'login.password_reset', 'actionButton' ]).subscribe(t => {
            const prompt = this.alertController.create({
                title: t[ 'login.password_reset' ].title,
                message: t[ 'login.password_reset' ].desc,
                inputs: [
                    {
                        name: 'login',
                        placeholder: t[ 'login.password_reset' ].login
                    },
                ],
                buttons: [
                    {
                        text: t[ 'actionButton' ][ 'Cancel' ],
                        handler: () => {
                        }
                    },
                    {
                        text: t[ 'actionButton' ][ 'Submit' ],
                        handler: data => {
                            console.log('[LoginPage] - doPasswordReset - submit', data);
                            this.userService.forgotPasswd(data.login).subscribe(res => {
                                if (res.status === true) {
                                    this.displayPasswordResetOk();
                                } else {
                                    this.presentToast(res.message);
                                }
                            }, error => {
                                this.presentToast(error.message);
                            });
                        }
                    }
                ]
            });
            prompt.present();
        });
    }

    private displayPasswordResetOk() {
        this.translateService.get([ 'login.password_reset', 'actionButton' ]).subscribe(t => {
            const prompt = this.alertController.create({
                title: t[ 'login.password_reset' ].title,
                message: t[ 'login.password_reset' ].modalForgotPwdOk,
                buttons: [

                    {
                        text: t[ 'actionButton' ][ 'Ok' ],
                        handler: () => {
                        }
                    }
                ]
            });
            prompt.present();
        })
    }


    /**
     *
     * @param msg
     */
    private presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
        });

        toast.present();
    }
}
