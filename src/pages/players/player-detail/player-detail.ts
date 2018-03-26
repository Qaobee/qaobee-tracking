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
import { PersonService } from './../../../providers/api/api.person.service';

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
   */
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private personService: PersonService) {
    this.player = navParams.get('player');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerDetailPage');
  }

  editPlayer() {
    console.log('editPlayer() -> PlayerDetailPage');
  }

  disactivatePlayer(desactived:string) {
    console.log('disablePlayer('+desactived+') -> PlayerDetailPage');
    this.player.desactivated = desactived;
    this.personService.updatePerson(this.player).subscribe(person => {
      console.log('updatePerson('+desactived+') -> PlayerDetailPage');
    });
  }

  goToStats() {
    console.log('goToStats() -> PlayerDetailPage');
  }

}
