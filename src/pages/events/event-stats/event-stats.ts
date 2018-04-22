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
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-event-stats',
  templateUrl: 'event-stats.html',
})
export class EventStatsPage {

  event: any;
  ownerId: any[] = []

  /**
   *
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.event = navParams.get('event');
    this.ownerId.push(this.event._id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventStatsPage');
  }

  deleteCollect() {
    console.log('deleteCollect EventStatsPage');
  }

}
