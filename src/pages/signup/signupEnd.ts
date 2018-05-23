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
                public  viewCtrl: ViewController) {

    }

    /**
     *
     */
    ionViewDidLoad() {
        console.debug('ionViewDidLoad SignupEndPage');
    }

    /**
     *
     */
    goToLogin() {
        this.navCtrl
            .push(LoginPage)
            .then(() => {
                // On supprime toutes les stacks des vues pour repartir dans une navigation propre
                const index = this.viewCtrl.index;
                for (let i = index; i > 0; i--) {
                    this.navCtrl.remove(i);
                }
            });
    }
}
