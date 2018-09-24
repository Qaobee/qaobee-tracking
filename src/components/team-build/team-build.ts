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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ENV } from '@app/env';
import { TranslateService } from '@ngx-translate/core';
import { Alert, AlertController, NavController, NavParams } from 'ionic-angular';
import _ from 'lodash';
import { StatType } from '../../model/stat.type';

@Component({
    selector: 'team-build-component',
    templateUrl: 'team-build.html',
})
export class TeamBuildComponent {
    root: string = ENV.hive;
    translations: any = {};
    @Input() playerList: any[] = [];
    @Input() isTeamBuilding: boolean = true;
    @Input() playerPositions: any = {
        substitutes: []
    };
    @Input() sanctions: { playerId: string, sanction: StatType, time: number, position: string, done: boolean }[] = [];

    @Output() playerPositionsChange: EventEmitter<any> = new EventEmitter();

    ground = [
        [ {key: 'pivot', label: 'pivot', class: 'blue-grey'} ],
        [
            {key: 'left-backcourt', label: 'left_backcourt', class: 'white'},
            {key: 'center-backcourt', label: 'center_backcourt', class: 'white'},
            {key: 'right-backcourt', label: 'right_backcourt', class: 'white'}
        ],
        [
            {key: 'left-wingman', label: 'left_wingman', class: 'white'},
            {key: 'goalkeeper', label: 'goalkeeper', class: 'indigo'},
            {key: 'right-wingman', label: 'right_wingman', class: 'white'}
        ]
    ];

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {TranslateService} translateService
     * @param {AlertController} alertCtrl
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private translateService: TranslateService,
                private alertCtrl: AlertController
    ) {
        this.translateService.get([ 'collect.team-build', 'actionButton' ]).subscribe(t => {
            this.translations = t;
        });
    }


    /**
     *
     * @param {string} position
     */
    showPlayerChooser(position: string) {
        console.debug('[TeamBuildComponent] - showPlayerChooser - playerPositions', this.playerPositions);
        if (this.hasRedCard(position)) {
            return;
        } else {
            let alert = this.alertCtrl.create();
            alert.setTitle(this.translations[ 'collect.team-build' ][ 'player-choose' ]);
            let excludedPlayer = [];
            Object.keys(this.playerPositions).forEach(k => {
                if (Array.isArray(this.playerPositions[ k ])) {
                    excludedPlayer = excludedPlayer.concat(this.playerPositions[ k ]);
                } else if (k !== position && this.playerPositions[ k ] && this.playerPositions[ k ]._id) {
                    excludedPlayer.push(this.playerPositions[ k ]);
                }
            });
            console.debug('[TeamBuildComponent] - showPlayerChooser - sanctions', this.sanctions);
            console.debug('[TeamBuildComponent] - showPlayerChooser - excludedPlayer', excludedPlayer);
            console.debug('[TeamBuildComponent] - showPlayerChooser - playerList', this.playerList);
            if (this.isTeamBuilding) {
                this.playerList.forEach(p => {
                    if (!excludedPlayer.find(item => {
                        return item._id === p._id;
                    }) && !this.sanctions[ p._id ]) {
                        alert.addInput({
                            type: 'radio',
                            label: p.firstname + ' ' + p.name + ' (' + p.status.squadnumber + ')',
                            value: p,
                            checked: this.playerPositions[ position ] && this.playerPositions[ position ]._id === p._id,
                            handler: data => {
                                console.debug(position, data.value);
                                this.playerPositions[ position ] = data.value;
                                alert.dismiss();
                            }
                        });
                    }
                });
            } else {
                Object.keys(this.playerPositions).forEach(k => {
                    if (Array.isArray(this.playerPositions[ k ])) {
                        this.playerPositions[ k ].forEach(p => {
                            this.addplayerToAlert(alert, p, position, k);
                        });
                    } else {
                        const p = this.playerPositions[ k ];
                        this.addplayerToAlert(alert, p, position, k);
                    }
                });
            }
            if (this.isTeamBuilding) {
                alert.addButton({
                    text: this.translations.actionButton.Clear,
                    handler: data => {
                        console.debug('[TeamBuildPage] - showPlayerChooser - clear', position, data);
                        delete this.playerPositions[ position ];
                        if (data) {
                            this.playerList.push(data);
                        }
                    }
                });
            }
            alert.addButton({
                text: this.translations.actionButton.Ok,
                handler: data => {
                    console.debug('[TeamBuildPage] - showPlayerChooser - add', position, data);
                    this.playerPositions[ position ] = data;
                }
            });
            alert.present();
        }
    }


    private addplayerToAlert(alert: Alert, chosen: any, chosenPosition: string, positionBefore) {
        alert.addInput({
            type: 'radio',
            label: chosen.firstname + ' ' + chosen.name + ' (' + chosen.status.squadnumber + ')',
            value: chosen,
            checked: this.playerPositions[ chosenPosition ] && this.playerPositions[ chosenPosition ]._id === chosen._id,
            handler: data => {
                console.debug(chosenPosition, data.value);
                if ('substitutes' === positionBefore) {
                    this.playerPositions[ positionBefore ] = this.playerPositions[ positionBefore ].filter(p => {
                        return p._id !== data.value._id;
                    });
                    this.playerPositions[ positionBefore ].push(this.playerPositions[ chosenPosition ]);
                } else {
                    this.playerPositions[ positionBefore ] = this.playerPositions[ chosenPosition ];
                }
                this.playerPositions[ chosenPosition ] = data.value;
                alert.dismiss();
            }
        });
    }

    /**
     *
     * @param {string} position
     */
    showSubstituesChooser(position: string) {
        console.debug('[TeamBuildComponent] - showSubstituesChooser - playerPositions', this.playerPositions);
        let alert = this.alertCtrl.create();
        alert.setTitle(this.translations[ 'collect.team-build' ][ 'players-choose' ]);
        let excludedPlayer = [];
        Object.keys(this.playerPositions).forEach(k => {
            if (Array.isArray(this.playerPositions[ k ])) {
                excludedPlayer = excludedPlayer.concat(this.playerPositions[ k ]);
            } else if (k !== position && this.playerPositions[ k ] && this.playerPositions[ k ]._id) {
                excludedPlayer.push(this.playerPositions[ k ])
            }
        });
        this.sanctions.forEach(p => {
            if (p.sanction === StatType.RED_CARD) {
                excludedPlayer = excludedPlayer.concat(this.playerList.filter(f => f._id === p.playerId));
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
                    checked: this.playerPositions[ position ] ? this.playerPositions[ position ].find(c => c._id === p._id) : false,
                });
            }
        });

        alert.addButton({
            text: this.translations.actionButton.Clear,
            handler: data => {
                console.debug('[TeamBuildComponent] - showSubstituesChooser - clear', position, data);
                delete this.playerPositions[ position ];
                if (data) {
                    this.playerList.push(data);
                }
            }
        });
        alert.addButton({
            text: this.translations.actionButton.Ok,
            handler: data => {
                console.debug('[TeamBuildComponent] - showSubstituesChooser - add', position, data);
                this.playerPositions[ position ] = this.playerPositions[ position ].concat(data);
            }
        });
        alert.present();
    }


    /**
     *
     * @param s
     */
    remove(s: any) {
        this.playerPositions[ 'substitutes' ] = this.playerPositions[ 'substitutes' ].filter(p => p._id !== s._id);
    }

    /**
     *
     * @param {string} avatar
     * @returns {string}
     */
    getAvatar(avatar: string): string {
        if (avatar && avatar !== 'null') {
            return this.root + '/file/SB_Person/' + avatar;
        } else {
            return '/assets/imgs/user.png';
        }
    }

    /**
     * @param  {string} playerId
     */
    hasOrangeCard(playerId: string) {
        return _.findIndex(this.sanctions, o => {
            return o.playerId === playerId && o.sanction === StatType.ORANGE_CARD;
        }) > -1;
    }

    /**
     * @param  {string} position
     */
    hasRedCard(position: string) {
        return _.findIndex(this.sanctions, o => {
            return o.sanction === StatType.RED_CARD && o.position === position && !o.done
        }) > -1;
    }

    /**
     * @param  {string} playerId
     */
    hasYellowCard(playerId: string): boolean {
        return _.findIndex(this.sanctions, o => {
            return o.playerId === playerId && o.sanction === StatType.YELLOW_CARD;
        }) > -1;
    }

    /**
     * @param  {any} pos
     */
    getColor(pos: any) {
        if (this.hasRedCard(pos.key)) {
            return 'red';
        } else if (this.playerPositions[ pos.key ] && this.hasYellowCard(this.playerPositions[ pos.key ]._id)) {
            return 'yellow';
        } else {
            return pos.class;
        }
    }
}
