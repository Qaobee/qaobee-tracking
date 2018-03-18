import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UniqueDeviceID} from '@ionic-native/unique-device-id';

import {UserService} from '../../services/userService';
import {SignupPage} from '../signup/signup';
import {Storage} from '@ionic/storage';
import {MenuPage} from "../menu/menu";
import {AuthenticationService} from "../../services/authenticationService";

/**
 * LoginPage page.
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    private login: string;
    private passwd: string;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {UserService} userService
     * @param {Storage} storage
     * @param {UniqueDeviceID} uniqueDeviceID
     * @param {AuthenticationService} authenticationService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private userService: UserService,
                private storage: Storage,
                private uniqueDeviceID: UniqueDeviceID,
                private authenticationService: AuthenticationService) {
        this.storage.get("login").then(l => {
            this.login = l;
        })
    }

    /** */
    doLogin() {
        this.uniqueDeviceID.get()
            .then((uuid: any) => {
                console.log(uuid)
                this.submitLogin(uuid);
            }).catch((error: any) => {
            console.error(error);
            this.submitLogin("123456-" + this.login);
        });
    }

    /** */
    goToSignup() {
        this.navCtrl.push(SignupPage, {});
    }

    submitLogin(uuid: string) {
        this.userService.login(this.login, this.passwd, uuid).subscribe((result: any) => {
            if (result) {
                this.authenticationService.isLogged = true;
                this.authenticationService.token = result.account.token;
                this.authenticationService.user = result;
                this.storage.set("login", this.login);
                this.storage.set("mobileToken", uuid);
                console.log(result);
                this.navCtrl.push(MenuPage, {user: result});
            }
        });
    }
}
