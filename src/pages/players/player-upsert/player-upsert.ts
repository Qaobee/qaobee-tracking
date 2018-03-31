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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { PersonService } from './../../../providers/api/api.person.service';
import { ActivityCfgService } from './../../../providers/api/api.activityCfg.service';
import {LocationService} from "../../../providers/location.service";
import {AuthenticationService} from "../../../providers/authentication.service";


@Component({
  selector: 'page-player-upsert',
  templateUrl: 'player-upsert.html',
})
export class PlayerUpsertPage {

  player: any;
  listPositionType: any[] = [];
  listLaterality: any[] = [];
  playerForm: FormGroup;
  address: any;
  autocompleteItems = [];

  /**
   * 
   * @param navCtrl 
   * @param navParams 
   */
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              private activityCfgService: ActivityCfgService,
              private authenticationService: AuthenticationService,
              private personService: PersonService,
              private locationService: LocationService)
  {
    this.player = navParams.get('player') || {};

    this.playerForm = this.formBuilder.group({
      'name': [this.player.name || '', [Validators.required]],
      'firstname': [this.player.firstname || '', [Validators.required]],
      'squadnumber': [this.player.status.squadnumber || '', [Validators.required]],
      'positionType': [this.player.status.positionType, [Validators.required]],
      'laterality': [this.player.status.laterality, [Validators.required]],
      'weight': [this.player.status.weight || '', [Validators.required]],
      'height': [this.player.status.height || '', [Validators.required]]
    });

    this.activityCfgService.getParamFieldList(authenticationService.meta.activity._id, 'listPositionType').subscribe((listPositionType: any[]) => {
      if (listPositionType) {
          this.listPositionType = listPositionType;
          console.log('this.listPositionType',this.listPositionType);
      }
    });

    this.activityCfgService.getParamFieldList(authenticationService.meta.activity._id, 'listLaterality').subscribe((listLaterality: any[]) => {
      if (listLaterality) {
          this.listLaterality = listLaterality;
          console.log('this.listLaterality',this.listLaterality);
      }
    });
  }

  isValid(field: string) {
    let formField = this.playerForm.controls[field];
    return formField.valid || formField.pristine;
  }

  /**
   *
   */
  updateSearchResults() {
    this.locationService.updateSearchResults(this.playerForm.controls['address'].value, result => {
        this.autocompleteItems = result;
    });
  }

  /**
   *
   * @param item
   */
  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.playerForm.controls['address'].setValue(item.description);
    this.locationService.selectSearchResult(item, this.address, result => {
        this.player.address = {
            formatedAddress: item.description,
            place: result.address_components[0].long_name + ', ' + result.address_components[1].long_name,
            zipcode: result.address_components[6].long_name,
            city: result.address_components[2].long_name,
            country: result.address_components[5].long_name,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
        };
    });
  }

  cancel() {
    this.navCtrl.pop();
  }

  validate () {
    console.log('validate PlayerUpsertPage : ');
  }

}
