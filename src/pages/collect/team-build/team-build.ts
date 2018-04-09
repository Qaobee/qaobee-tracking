import { GameState } from './../../../model/game.state';
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
import { AlertController, NavController, NavParams, ToastController } from 'ionic-angular';
import { PersonService } from "../../../providers/api/api.person.service";
import { AuthenticationService } from "../../../providers/authentication.service";
import { Storage } from "@ionic/storage";
import { ENV } from "@app/env";
import { SettingsService } from "../../../providers/settings.service";
import { CollectPage } from "../collect/collect";
import moment from 'moment';
import { CollectService } from '../../../providers/api/api.collect.service';
import { EffectiveService } from '../../../providers/api/api.effective.service';

/**
 * Generated class for the EventListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-team-build',
    templateUrl: 'team-build.html',
})
export class TeamBuildPage {
    // TODO : i18n
    root: string = ENV.hive;
    event: any;
    playerList: any[] = [];
    playerListSize: number;
    playerPositions: any = {
        substitutes: []
    };
    collect: any = {};

    ground = [
        [{ key: 'pivot', label: 'Pivot', class: 'pivot' }],
        [{ key: 'left-backcourt', label: 'Back-court', class: '' }, {
            key: 'center-backcourt',
            label: 'Back-court'
        }, { key: 'right-backcourt', label: 'Back-court' }],
        [{ key: 'left-wingman', label: 'Wing-man' }, { key: 'goalkeeper', label: 'Goalkeeper', class: 'goalkeeper' }, {
            key: 'right-wingman',
            label: 'Wing-man'
        }]
    ];


    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Storage} storage
     * @param {ToastController} toastCtrl
     * @param {AlertController} alertCtrl
     * @param {PersonService} personService
     * @param {SettingsService} settingsService
     * @param {AuthenticationService} authenticationService
     * @param {CollectService} collectService
     * @param {EffectiveService} effectiveService
     */
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private storage: Storage,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private personService: PersonService,
        private settingsService: SettingsService,
        private authenticationService: AuthenticationService,
        private collectService: CollectService,
        private effectiveService: EffectiveService,
    ) {
        this.event = navParams.get('event');
        this.storage.get('players').then(players => {
            if (!players) {
                this.getPlayers();
            } else {
                console.log('[TeamBuildPage] - constructor', players);
                this.playerList = players;
                this.playerListSize = players.length;
            }
        });
        this.storage.get('collects').then((collects: any[]) => {
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
        console.log('[TeamBuildPage] - testCollects', collects);
        if (collects.length > 0 && collects[0].eventRef._id === this.event._id) {
            this.storage.get('gameState-' + this.event._id).then((gameState: GameState) => {
                if (gameState) {
                    this.presentToast('Collect in progress');
                    console.log('[TeamBuildPage] - Collect in progress', collects[0]);
                    this.collect = collects[0];
                    this.goToResumeCollect();
                }
            });
        }
    }


    private getPlayers() {
        this.personService.getListPersonSandbox(this.authenticationService.meta._id).subscribe((players: any[]) => {
            console.log('[TeamBuildPage] - getPlayers', players);
            this.playerList = players;
            this.playerListSize = this.playerList.length;
            this.storage.set('players', players);
        });
    }

    /**
     * 
     * @param {string} position 
     */
    showPlayerChooser(position: string) {
        console.log('[TeamBuildPage] - showPlayerChooser : this.playerPositions', this.playerPositions)
        let alert = this.alertCtrl.create();
        alert.setTitle('Choose Player');
        let excludedPlayer = [];
        Object.keys(this.playerPositions).forEach(k => {
            if (Array.isArray(this.playerPositions[k])) {
                excludedPlayer = excludedPlayer.concat(this.playerPositions[k]);
            } else if (k !== position && this.playerPositions[k] && this.playerPositions[k]._id) {
                excludedPlayer.push(this.playerPositions[k])
            }
        });
        console.log('[TeamBuildPage] - showPlayerChooser : excludedPlayer', excludedPlayer)
        this.playerList.forEach(p => {
            if (!excludedPlayer.find(item => {
                return item._id === p._id;
            })) {
                alert.addInput({
                    type: 'radio',
                    label: p.firstname + ' ' + p.name + ' (' + p.status.squadnumber + ')',
                    value: p,
                    checked: this.playerPositions[position] && this.playerPositions[position]._id === p._id,
                    handler: data => {
                        console.log(position, data.value);
                        this.playerPositions[position] = data.value;
                        alert.dismiss();
                    }
                });
            }
        });

        alert.addButton({
            text: 'Clear',
            handler: data => {
                console.log(position, data);
                delete this.playerPositions[position];
                this.playerList.push(data);
            }
        });
        alert.addButton({
            text: 'OK',
            handler: data => {
                this.playerPositions[position] = data;
            }
        });
        alert.present();
    }

    showSubstituesChooser(position: string) {
        console.log('[TeamBuildPage] - showSubstituesChooser : this.playerPositions', this.playerPositions)
        let alert = this.alertCtrl.create();
        alert.setTitle('Choose Players');
        let excludedPlayer = [];
        Object.keys(this.playerPositions).forEach(k => {
            if (Array.isArray(this.playerPositions[k])) {
                excludedPlayer = excludedPlayer.concat(this.playerPositions[k]);
            } else if (k !== position && this.playerPositions[k] && this.playerPositions[k]._id) {
                excludedPlayer.push(this.playerPositions[k])
            }
        });
        this.playerList.forEach(p => {
            if (!excludedPlayer.find(item => {
                return item._id === p._id;
            })) {
                alert.addInput({
                    type: 'checkbox',
                    label: p.firstname + ' ' + p.name + ' (' + p.status.squadnumber + ')',
                    value: p,
                    checked: this.playerPositions[position].find(c => c._id === p._id),
                });
            }
        });

        alert.addButton({
            text: 'Clear',
            handler: data => {
                console.log(position, data);
                delete this.playerPositions[position];
                this.playerList.push(data);
            }
        });
        alert.addButton({
            text: 'OK',
            handler: data => {
                console.log(position, data);
                this.playerPositions[position] = this.playerPositions[position].concat(data);
            }
        });
        alert.present();
    }


    remove(s: any) {
        this.playerPositions['substitutes'] = this.playerPositions['substitutes'].filter(p => p._id !== s._id);
    }

    goToResumeCollect() {
        console.log('[TeamBuildPage] - goToResumeCollect');
        this.navCtrl.push(CollectPage, { event: this.event, collect: this.collect });
    }
    /**
     *
     */
    goToCollect() {
        console.log('[TeamBuildPage] - goToCollect');

        let playerIds = [];
        let count = 0;
        Object.keys(this.playerPositions).forEach(k => {
            if (Array.isArray(this.playerPositions[k])) {
                count += this.playerPositions[k].length;
                this.playerPositions[k].forEach(p => {
                    playerIds.push(p._id);
                });
            } else {
                playerIds.push(this.playerPositions[k]._id);
                count++
            }
        });
        if (count < this.settingsService.activityCfg.nbMinPlayers || count > this.settingsService.activityCfg.nbMaxPlayers) {
            this.presentToast('Your team must have between ' + this.settingsService.activityCfg.nbMinPlayers + ' and ' + this.settingsService.activityCfg.nbMaxPlayers + ' players');
        } else {
            this.collect = {
                status: 'pending',
                eventRef: this.event,
                players: playerIds,
                startDate: moment.utc().valueOf(),
                observers: [{
                    userId: this.authenticationService.user._id
                }, {
                    indicators: ['all']
                }],
                parametersGame: this.settingsService.getCollectInfos()
            }

            this.collectService.addCollect(this.collect).subscribe((c: any) => {
                this.collect._id = c._id;
                this.storage.get('collects').then((collects: any) => {
                    if (!collects) {
                        collects = {};
                    }
                    collects[this.collect._id] = this.collect;
                    this.storage.set('collects', collects);
                    console.log('[TeamBuildPage] - goToCollect', { players: this.playerPositions, event: this.event, collect: this.collect } );
                    this.navCtrl.push(CollectPage, { players: this.playerPositions, event: this.event, collect: this.collect });
                });
            });
        }
    }

    ionViewDidLoad() {
        console.log('[TeamBuildPage] - ionViewDidLoad', this.event);
    }

    /**
     *
     * @param {string} avatar
     * @returns {string}
     */
    getAvatar(avatar: string) {
        if (avatar && avatar !== 'null') {
            return this.root + '/file/SB_Person/' + avatar;
        } else {
            return '/assets/imgs/user.png';
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

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
}
