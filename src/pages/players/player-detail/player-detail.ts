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
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PersonService } from './../../../providers/api/api.person.service';
import { PlayerUpsertPage } from './../player-upsert/player-upsert';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-player-detail',
  templateUrl: 'player-detail.html',
})
export class PlayerDetailPage {

  player:any;

  /**
   * 
   * @param navCtrl 
   * @param navParams 
   * @param personService 
   * @param alertCtrl 
   * @param translateService 
   */
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private personService: PersonService,
              private alertCtrl: AlertController,
              private translateService: TranslateService) {
    this.player = navParams.get('player');
  }

  editPlayer() {
    this.navCtrl.push(PlayerUpsertPage, {player : this.player});
  }

  desactivatePlayer(confirmLabels:string, desactived:string) {
    this.translateService.get(confirmLabels).subscribe(
      value => {
        let alert = this.alertCtrl.create({
          title: value.title,
          message: value.message,
          buttons: [
            {
              text: value.buttonLabelCancel,
              role: 'cancel',
              handler: () => {}
            },
            {
              text: value.buttonLabelConfirm,
              handler: () => {
                this.player.desactivated = desactived;
                this.personService.updatePerson(this.player).subscribe(person => {});
              }
            }
          ]
        });
        alert.present();
      }
    )
  }

  goToStats() {
    console.log('goToStats() -> PlayerDetailPage');
  }

}
