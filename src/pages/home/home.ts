import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthenticationService } from "../../providers/authentication.service";
import { PlayerListPage } from '../players/player-list/player-list';
import { EventListPage } from '../events/event-list/event-list';
import { CollectListPage } from "../collect/collect-list/collect-list";
import introJs from 'intro.js/intro.js';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    user: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AuthenticationService} authenticationService
     */
    constructor(public navCtrl: NavController, public navParams: NavParams,
                private authenticationService: AuthenticationService) {
        this.user = navParams.get('user');
        if (!this.user) {
            this.user = this.authenticationService.user;
        }
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.startTour();
    }

    startTour() {
        console.log('Starting tour');
        let intro = introJs.introJs();
        intro.setOptions({
            steps: [
                {
                    element: "#step1",
                    intro: "Plan events : You can create an event or see the championship.",
                    position: "bottom"
                },
                {
                    element: "#step2",
                    intro: "Manage your players :  You add or update your players.",
                    position: "bottom"
                },
                {
                    element: "#step3",
                    intro: "Anytime, you can see the event's statistics.",
                    position: "bottom"
                },
                {
                    element: "#step4",
                    intro: "To change game settings (half-time duration, player count, etc…) select Settings in the main menu.",
                    position: "bottom"
                }
            ],
            showProgress: false,
            skipLabel: "Skip",
            doneLabel: "Ok",
            nextLabel: ">",
            prevLabel: "<",
            overlayOpacity: "0.8",
            tooltipPosition: 'top',
            hidePrev: true,
            hideNext: true,
            showStepNumbers: false
        });
        intro.start();

    }

    /**
     *
     */
    goToEventList() {
        this.navCtrl.push(EventListPage);
    }

    /**
     *
     */
    goToPlayerList() {
        this.navCtrl.push(PlayerListPage);
    }

    /**
     *
     */
    goToCollectList() {
        this.navCtrl.push(CollectListPage);
    }
}
