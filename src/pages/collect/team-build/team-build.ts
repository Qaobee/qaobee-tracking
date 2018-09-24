/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.
 *  Qaobee
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
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { PersonService } from "../../../providers/api/api.person.service";
import { AuthenticationService } from "../../../providers/authentication.service";
import { Storage } from "@ionic/storage";
import { ENV } from "@app/env";
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from "../../../providers/settings.service";
import { CollectPage } from "../collect/collect";
import moment from 'moment';
import { CollectService } from '../../../providers/api/api.collect.service';
import { EffectiveService } from '../../../providers/api/api.effective.service';
import { GameState } from '../../../model/game.state';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-team-build',
    templateUrl: 'team-build.html',
})
export class TeamBuildPage {
    root: string = ENV.hive;
    event: any;
    playerList: any[] = [];
    playerListSize: number;
    playerPositions: any = {
        substitutes: []
    };
    collect: any = {};
    steps: any[];
    private settings: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Storage} storage
     * @param {ToastController} toastCtrl
     * @param {PersonService} personService
     * @param {SettingsService} settingsService
     * @param {AuthenticationService} authenticationService
     * @param {TranslateService} translateService
     * @param {CollectService} collectService
     * @param {EffectiveService} effectiveService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: Storage,
                private toastCtrl: ToastController,
                private personService: PersonService,
                private settingsService: SettingsService,
                private authenticationService: AuthenticationService,
                private translateService: TranslateService,
                private collectService: CollectService,
                private effectiveService: EffectiveService,
                private ga: GoogleAnalytics
    ) {
        this.event = navParams.get('event');

        this.settingsService.getParametersGame().subscribe(settings => {
            this.settings = settings;
        });
        this.storage.get(this.authenticationService.meta._id + '-players').then(players => {
            if (!players) {
                this.getPlayers();
            } else {
                console.debug('[TeamBuildPage] - constructor', players);
                this.playerList = players.filter((p)=>!p.deactivated || p.deactivated === 'false');
                this.playerListSize = players.length;
            }
        });

        this.storage.get(this.authenticationService.meta._id + '-collects').then((collects: any[]) => {
            if (collects) {
                this.testCollects(collects);
            } else {
                this.storage.get('effectives').then((effectives: any[]) => {
                    if (effectives) {
                        this.retriveCollects(effectives);
                    } else {
                        this.effectiveService.getList(this.authenticationService.meta._id).subscribe((effectivesFromAPI: any[]) => {
                            this.retriveCollects(effectivesFromAPI);
                        });
                    }
                });
            }
        });
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('TeamBuildPage');
    }

    private startTour() {
        this.storage.get(this.authenticationService.meta._id + "-tour-team-build").then(tourDone => {
            if (!tourDone) {
                this.translateService.get('showcase').subscribe(showcase => {
                    this.steps = [
                        {
                            target: '#ground-area > ion-row:nth-child(1) > ion-col > ion-chip',
                            description: showcase.team.position,
                            position: 'bottom'
                        },
                        {
                            target: '#substitute-area ion-fab',
                            description: showcase.team.substitutes,
                            position: 'bottom'
                        },
                        {
                            target: "ion-header ion-buttons button",
                            description: showcase.team.start,
                            position: "bottom"
                        },
                    ];
                });
            }
        });
    }

    endTour() {
        this.storage.set(this.authenticationService.meta._id + "-tour-team-build", true).then(() => {
        });
    }

    /**
     * @param  {any[]} effectives
     */
    private retriveCollects(effectives: any[]) {
        effectives.forEach(eff => {
            this.collectService.getCollects(
                this.authenticationService.meta._id,
                this.event._id, eff._id, this.event.participants.teamHome._id,
                this.authenticationService.meta.season.startDate,
                this.authenticationService.meta.season.endDate
            ).subscribe((collects: any[]) => {
                this.testCollects(collects);
            });
        });
    }

    /**
     * @param  {any[]} collects
     */
    private testCollects(collects: any[]) {
        console.debug('[TeamBuildPage] - testCollects', collects);
        if (collects.length > 0 && collects[ 0 ].eventRef._id === this.event._id && collects[ 0 ].status !== 'done') {
            this.storage.get('gameState-' + this.event._id).then((gameState: GameState) => {
                console.log('[TeamBuildPage] - Collect gameState', gameState);
                if (gameState) {
                    this.translateService.get('collect.team-build.collect-in-progress').subscribe(t => {
                        this.presentToast(t);
                        console.log('[TeamBuildPage] - Collect in progress', collects[ 0 ]);
                        this.collect = collects[ 0 ];
                        this.goToResumeCollect();
                    });
                }
            });
        } else {
            window.setTimeout(() => this.startTour(), 500);
        }
    }

    /**
     *
     */
    private getPlayers() {
        this.personService.getListPersonSandbox(this.authenticationService.meta._id).subscribe((players: any[]) => {
            console.debug('[TeamBuildPage] - getPlayers', players);
            this.playerList = players.filter((p)=>!p.deactivated || p.deactivated === 'false');
            this.playerListSize = this.playerList.length;
            this.storage.set(this.authenticationService.meta._id + '-players', players);
        });
    }

    /**
     *
     */
    goToResumeCollect() {
        console.debug('[TeamBuildPage] - goToResumeCollect');
        this.navCtrl.push(CollectPage, {event: this.event, collect: this.collect, playerList: this.playerList});
    }

    /**
     *
     */
    goToCollect() {
        console.debug('[TeamBuildPage] - goToCollect');
        let playerIds = [];
        let count = 0;

        this.settingsService.init();
        Object.keys(this.playerPositions).forEach(k => {
            if (Array.isArray(this.playerPositions[ k ])) {
                count += this.playerPositions[ k ].length;
                this.playerPositions[ k ].forEach(p => {
                    playerIds.push(p._id);
                });
            } else {
                playerIds.push(this.playerPositions[ k ]._id);
                count++
            }
        });

        console.debug('[TeamBuildPage] - goToCollect - count', this.settings.nbMinPlayers, count, this.settings.nbMaxPlayers);
        if (count < this.settings.nbMinPlayers || count > this.settings.nbMaxPlayers) {
            this.translateService.get('collect.team-build.team-limits', {
                min: this.settings.nbMinPlayers,
                max: this.settings.nbMaxPlayers
            }).subscribe(t => {
                this.presentToast(t);
            })
        } else {
            this.collect = {
                status: 'pending',
                eventRef: this.event,
                players: playerIds,
                startDate: moment.utc().valueOf(),
                observers: [ {
                    userId: this.authenticationService.user._id
                }, {
                    indicators: [ 'all' ]
                } ],
                parametersGame: this.settings
            };
            console.debug('[TeamBuildPage] - goToCollect -collect', this.collect);
            this.collectService.addCollect(this.collect).subscribe((c: any) => {
                this.collect._id = c._id;
                this.storage.get(this.authenticationService.meta._id + '-collects').then((collects: any[]) => {
                    if (!collects) {
                        collects = [];
                    }
                    collects.push(this.collect);
                    this.storage.set(this.authenticationService.meta._id + '-collects', collects);
                    console.debug('[TeamBuildPage] - goToCollect', {
                        players: this.playerPositions,
                        event: this.event,
                        collect: this.collect,
                        playerList: this.playerList
                    });
                    this.navCtrl.push(CollectPage, {
                        players: this.playerPositions,
                        event: this.event,
                        collect: this.collect,
                        playerList: this.playerList
                    });
                });
            });
        }
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
        toast.present();
    }
}
