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
// TODO : i18n
@Component({
  selector: 'team-build-component',
  templateUrl: 'team-build.html',
})
export class TeamBuildComponent {
  root: string = ENV.hive;

  @Input() playerList: any[] = [];
  @Input() playerPositions: any = {
    substitutes: []
  };
  @Output() playerPositionsChange: EventEmitter<any> = new EventEmitter();

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
   * @param {AlertController} alertCtrl
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController
  ) {
   
  }


  /**
   *
   * @param {string} position
   */
  showPlayerChooser(position: string) {
    console.log('[TeamBuildPage] - showPlayerChooser : this.playerPositions', this.playerPositions);
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
    console.log('[TeamBuildPage] - showPlayerChooser : excludedPlayer', excludedPlayer);
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
    console.log('[TeamBuildPage] - showSubstituesChooser : this.playerPositions', this.playerPositions);
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
