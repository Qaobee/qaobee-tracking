import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthenticationService } from "../../providers/authentication.service";
import { PlayerListPage } from '../players/player-list/player-list';
import { EventListPage } from '../events/event-list/event-list';
import { CollectListPage } from "../collect/collect-list/collect-list";
import introJs from 'intro.js/intro.js';
import { TeamListPage } from "../teams/team-list/team-list";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";

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
     * @param {TranslateService} translateService
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private translateService: TranslateService,
                private storage: Storage,
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

    private startTour() {
        this.storage.get(this.authenticationService.meta._id + "-tour-home").then(tourDone => {
            if (!tourDone) {
                let intro = introJs.introJs();
                this.translateService.get('showcase').subscribe(showcase => {
                    intro.setOptions({
                        steps: [
                            {
                                element: "#step1",
                                intro: showcase.home.events,
                                position: "bottom"
                            },
                            {
                                element: "#step2",
                                intro: showcase.home.players,
                                position: "bottom"
                            },
                            {
                                element: "#step3",
                                intro: showcase.home.stats,
                                position: "bottom"
                            },
                            {
                                element: "#step4",
                                intro: showcase.home.settings,
                                position: "bottom"
                            }
                        ],
                        showProgress: false,
                        skipLabel: showcase.navigation.skip,
                        doneLabel: showcase.navigation.ok,
                        nextLabel: showcase.navigation.next,
                        prevLabel: showcase.navigation.prev,
                        overlayOpacity: "0.8",
                        tooltipPosition: 'top',
                        hidePrev: true,
                        hideNext: true,
                        showStepNumbers: false
                    });
                    intro.oncomplete(this.endTour.bind(this));
                    intro.start();
                });
            }
        });
    }

    private endTour() {
        this.storage.set(this.authenticationService.meta._id + "-tour-home", true).then(() => {
        });
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
    goToTeamsList() {
        this.navCtrl.push(TeamListPage);
    }

    /**
     *
     */
    goToCollectList() {
        this.navCtrl.push(CollectListPage);
    }
}
