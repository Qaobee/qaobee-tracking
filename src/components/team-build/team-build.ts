import { TranslateService } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
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
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { ENV } from "@app/env";
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
  @Output() playerPositionsChange: EventEmitter<any> = new EventEmitter();

  ground = [
    [{ key: 'pivot', label: 'pivot', class: 'blue-grey' }],
    [
      { key: 'left-backcourt', label: 'left_backcourt', class: 'white' },
      { key: 'center-backcourt', label: 'center_backcourt', class: 'white' },
      { key: 'right-backcourt', label: 'right_backcourt', class: 'white' }
    ],
    [
      { key: 'left-wingman', label: 'left_wingman', class: 'white' },
      { key: 'goalkeeper', label: 'goalkeeper', class: 'red' },
      { key: 'right-wingman', label: 'right_wingman', class: 'white' }
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
    this.translateService.get(['collect.team-build', 'actionButton']).subscribe(t => {
      this.translations = t;
    });
  }


  /**
   *
   * @param {string} position
   */
  showPlayerChooser(position: string) {
    console.log('[TeamBuildPage] - showPlayerChooser - playerPositions', this.playerPositions);
    let alert = this.alertCtrl.create();
    alert.setTitle(this.translations['collect.team-build']['player-choose']);
    let excludedPlayer = [];
    Object.keys(this.playerPositions).forEach(k => {
      if (Array.isArray(this.playerPositions[k])) {
        excludedPlayer = excludedPlayer.concat(this.playerPositions[k]);
      } else if (k !== position && this.playerPositions[k] && this.playerPositions[k]._id) {
        excludedPlayer.push(this.playerPositions[k])
      }
    });
    console.log('[TeamBuildPage] - showPlayerChooser - excludedPlayer', excludedPlayer);
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
      text: this.translations.actionButton.Clear,
      handler: data => {
        console.debug('[TeamBuildPage] - showPlayerChooser - clear', position, data);
        delete this.playerPositions[position];
        if(data) {
          this.playerList.push(data);
        }
      }
    });
    alert.addButton({
      text: this.translations.actionButton.Ok,
      handler: data => {
        console.debug('[TeamBuildPage] - showPlayerChooser - add', position, data);
        this.playerPositions[position] = data;
      }
    });
    alert.present();
  }

  showSubstituesChooser(position: string) {
    console.log('[TeamBuildPage] - showSubstituesChooser - playerPositions', this.playerPositions);
    let alert = this.alertCtrl.create();
    alert.setTitle(this.translations['collect.team-build']['players-choose']);
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
      text: this.translations.actionButton.Clear,
      handler: data => {
        console.debug('[TeamBuildPage] - showSubstituesChooser - clear', position, data);
        delete this.playerPositions[position];
        if(data) {
          this.playerList.push(data);
        }
      }
    });
    alert.addButton({
      text: this.translations.actionButton.Ok,
      handler: data => {
        console.debug('[TeamBuildPage] - showSubstituesChooser - add', position, data);
        this.playerPositions[position] = this.playerPositions[position].concat(data);
      }
    });
    alert.present();
  }


  remove(s: any) {
    this.playerPositions['substitutes'] = this.playerPositions['substitutes'].filter(p => p._id !== s._id);
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
}
