import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from "../../providers/authentication.service";

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-menu',
    templateUrl: 'menu.html',
})
export class MenuPage {
    private user: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AuthenticationService} authenticationService
     */
    constructor(public navCtrl: NavController, public navParams: NavParams,
        private authenticationService: AuthenticationService) {
        this.user = navParams.get('user');
        if(!this.user) {
            this.user = this.authenticationService.user;
        }
    }
}
