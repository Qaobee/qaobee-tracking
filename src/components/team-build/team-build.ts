import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ENV } from '@app/env';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
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
    @Input() playerPositions: any = {
        substitutes: []
    };
    @Input() sanctions: { playerId: string, sanction: StatType, time: number, position: string, done: boolean }[] = [];

    @Output() playerPositionsChange: EventEmitter<any> = new EventEmitter();

    ground = [
        [ {key: 'pivot', label: 'pivot', class: 'blue-grey'} ],
        [
            {key: 'left-wingman', label: 'left_wingman', class: 'white'},
            {key: 'center-backcourt', label: 'center_backcourt', class: 'white'},
            {key: 'right-wingman', label: 'right_wingman', class: 'white'}
        ],
        [
            {key: 'left-backcourt', label: 'left_backcourt', class: 'white'},
            {key: 'goalkeeper', label: 'goalkeeper', class: 'indigo'},
            {key: 'right-backcourt', label: 'right_backcourt', class: 'white'}
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
        console.debug('[TeamBuildPage] - showPlayerChooser - playerPositions', this.playerPositions);
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
            console.debug('[TeamBuildPage] - showPlayerChooser - sanctions', this.sanctions);
            console.debug('[TeamBuildPage] - showPlayerChooser - excludedPlayer', excludedPlayer);
            console.debug('[TeamBuildPage] - showPlayerChooser - playerList', this.playerList);
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

    /**
     *
     * @param {string} position
     */
    showSubstituesChooser(position: string) {
        console.debug('[TeamBuildPage] - showSubstituesChooser - playerPositions', this.playerPositions);
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
                console.debug('[TeamBuildPage] - showSubstituesChooser - clear', position, data);
                delete this.playerPositions[ position ];
                if (data) {
                    this.playerList.push(data);
                }
            }
        });
        alert.addButton({
            text: this.translations.actionButton.Ok,
            handler: data => {
                console.debug('[TeamBuildPage] - showSubstituesChooser - add', position, data);
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
