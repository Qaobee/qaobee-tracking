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
import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, ToastController} from 'ionic-angular';
import {PersonService} from "../../../providers/api/api.person.service";
import {AuthenticationService} from "../../../providers/authentication.service";
import {Storage} from "@ionic/storage";
import {ENV} from "@app/env";
import {SettingsService} from "../../../providers/settings.service";
import {CollectPage} from "../collect/collect";

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

    ground = [
        [{key: 'pivot', label: 'Pivot', class: 'pivot'}],
        [{key: 'left-backcourt', label: 'Back-court', class: ''}, {
            key: 'center-backcourt',
            label: 'Back-court'
        }, {key: 'right-backcourt', label: 'Back-court'}],
        [{key: 'left-wingman', label: 'Wing-man'}, {key: 'goalkeeper', label: 'Goalkeeper', class: 'goalkeeper'}, {
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
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: Storage,
                private toastCtrl: ToastController,
                private alertCtrl: AlertController,
                private personService: PersonService,
                private settingsService: SettingsService,
                private authenticationService: AuthenticationService) {
        this.event = navParams.get('event');
        this.storage.get('players').then(players => {
            if (!players) {
                this.getPlayers();
            } else {
                console.log('[TeamBuildPage] - constructor', players);
                this.playerList = players;
                this.playerListSize = players.length;
            }
        })
    }

    private getPlayers() {
        this.personService.getListPersonSandbox(this.authenticationService.meta._id).subscribe((players: any[]) => {
            console.log('[TeamBuildPage] - getPlayers', players);
            this.playerList = players;
            this.playerListSize = this.playerList.length;
            this.storage.set('players', players);
        });
    }

    showPlayerChooser(position: string) {
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
        this.playerList.forEach(p => {
            if (!excludedPlayer.find(item => {
                return item._id === p._id;
            })) {
                alert.addInput({
                    type: 'radio',
                    label: p.firstname + ' ' + p.name + ' (' + p.status.squadnumber + ')',
                    value: p,
                    checked: this.playerPositions[position] && this.playerPositions[position]._id === p._id
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
                if ('substitutes' === position) {
                    this.playerPositions[position].push(data);
                } else {
                    this.playerPositions[position] = data;
                }
            }
        });
        alert.present();
    }

    remove(s: any) {
        this.playerPositions['substitutes'] = this.playerPositions['substitutes'].filter(p => p._id !== s._is);
    }

    /**
     *
     */
    goToCollect() {
        console.log('[TeamBuildPage] - goToCollect');
        let count = 0;
        Object.keys(this.playerPositions).forEach(k => {
            if (Array.isArray(this.playerPositions[k])) {
                count += this.playerPositions[k].length;
            } else {
                count++
            }
        });
        if (count < this.settingsService.minPlayers || count > this.settingsService.maxPlayers) {
            this.presentToast('Your tem must have between ' + this.settingsService.minPlayers + ' and ' + this.settingsService.maxPlayers + ' players');
        } else {
            this.navCtrl.push(CollectPage, {players: this.playerPositions, event: this.event});
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
