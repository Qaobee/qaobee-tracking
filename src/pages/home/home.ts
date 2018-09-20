import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthenticationService } from "../../providers/authentication.service";
import { PlayerListPage } from '../players/player-list/player-list';
import { EventListPage } from '../events/event-list/event-list';
import { CollectListPage } from "../collect/collect-list/collect-list";
import { TeamListPage } from "../teams/team-list/team-list";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { TourComponent } from "../../components/tour/tour.component";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild('tour') tour: TourComponent;

    user: any;
    steps: any[];
    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {TranslateService} translateService
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private translateService: TranslateService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private ga: GoogleAnalytics) {
        this.user = navParams.get('user');
        if (!this.user) {
            this.user = this.authenticationService.user;
        }
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('HomePage');
        this.startTour();
    }

    private startTour() {
        this.storage.get(this.authenticationService.meta._id + "-tour-home").then(tourDone => {
            if (!tourDone) {
                this.translateService.get('showcase').subscribe(showcase => {
                    this.steps = [
                        {
                            target: '#step1',
                            description: showcase.home.events,
                            position: 'top'
                        },
                        {
                            target: '#step2',
                            description: showcase.home.players,
                            position: 'top'
                        },
                        {
                            target: "#step3",
                            description: showcase.home.stats,
                            position: "top"
                        },
                        {
                            target: "#step4",
                            description: showcase.home.settings,
                            position: "right"
                        }
                    ];
                });
            }
        });
    }

    endTour() {
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
