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
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-player-upsert',
  templateUrl: 'player-upsert.html',
})
export class PlayerUpsertPage {

  private mode: string;
  /**
   * 
   * @param navCtrl 
   * @param navParams 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mode = navParams.get('mode');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerUpsertPage : '+this.mode);
  }

}
