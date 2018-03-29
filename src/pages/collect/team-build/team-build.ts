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
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {PersonService} from "../../../providers/api/api.person.service";
import {AuthenticationService} from "../../../providers/authentication.service";
import {Storage} from "@ionic/storage";
import {ENV} from "@app/env";

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
    root: string = ENV.hive;
    event: any;
    playerList: any[] = [];
    playerListSize: number;
    playerPositions: any = {
        substitues: []
    };

    ground = [
        [{key: 'pivot', label: 'Pivot'}],
        [{key: 'left-backcourt', label: 'Back-court'}, {
            key: 'center-backcourt',
            label: 'Back-court'
        }, {key: 'right-backcourt', label: 'Back-court'}],
        [{key: 'left-wingman', label: 'Wing-man'}, {key: 'goalkeeper', label: 'Goalkeeper'}, {
            key: 'right-wingman',
            label: 'Wing-man'
        }]
    ];


    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Storage} storage
     * @param {AlertController} alertCtrl
     * @param {PersonService} personService
     * @param {AuthenticationService} authenticationService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: Storage,
                private alertCtrl: AlertController,
                private personService: PersonService,
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
            if (k !== position && this.playerPositions[k] && this.playerPositions[k]._id) {
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

        alert.addButton('Cancel');
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
                this.playerPositions[position] = data;
            }
        });
        alert.present();
    }

    /**
     *
     */
    ionViewDidLoad() {
        console.log('[TeamBuildPage] - ionViewDidLoad', this.event);
    }

    getAvatar(avatar: string) {
        if (avatar && avatar !== 'null') {
            return this.root + '/file/SB_Person/' + avatar;
        } else {
            return '/assets/imgs/user.png';
        }
    }
}
