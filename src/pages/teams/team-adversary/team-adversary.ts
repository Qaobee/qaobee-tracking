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

import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from '../../../providers/authentication.service';
import { EffectiveService } from '../../../providers/api/api.effective.service';
import { TeamService } from '../../../providers/api/api.team.service';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({ 
    selector: 'page-team-adversary',
    templateUrl: 'team-adversary.html',
})
export class TeamAdversaryPage {

    editMode: string;
    team: any;
    adversaries: any;
    myTeamId: string;
    teamForm: FormGroup;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {ToastController} toastCtrl
     * @param {AuthenticationService} authenticationService
     * @param {TeamService} teamService
     * @param {FormBuilder} formBuilder
     * @param {EffectiveService} effectiveService
     * @param {TranslateService} translateService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private authenticationService: AuthenticationService,
                private teamService: TeamService,
                private effectiveService: EffectiveService,
                private translateService: TranslateService,
                private ga: GoogleAnalytics) {
      this.editMode = navParams.get('editMode');
      this.myTeamId = navParams.get('myTeamId');

      if (this.editMode && this.editMode !== 'CREATE') {
        this.team = navParams.get('adversary');
      } else {
        this.team = {};
      }

      //Initialiaze team's form
      this.teamForm = this.formBuilder.group({
          'label': [ this.team.label|| '', [ Validators.required ] ]  
      });
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('TeamDetailPage');
        
    }

  /**
   *
   * @param {string} field
   * @returns {boolean}
   */
  isValid(field: string): boolean {
    let formField = this.teamForm.controls[ field ];
    return formField.valid || formField.pristine;
  }

  /**
   *
   */
  cancel() {
      this.navCtrl.pop();
  }

  /**
   *
   * @param formVal
   */
  saveAdversary(formVal) {

    if (this.teamForm.valid) {
      this.team.label = formVal.label;
      
      if (this.editMode === 'CREATE') {
        this.team.adversary = true;
        this.team.enable = true;
        
        //sandboxId
        this.team.sandboxId = this.authenticationService.meta._id;

        // retrieve effective Id
        this.effectiveService.get(this.authenticationService.meta.effectiveDefault).subscribe(effectiveGet=> {
          this.team.effectiveId = (effectiveGet as any)._id;

          let linkTeam: any[] = [];
          linkTeam.push(this.myTeamId);
          this.team.linkTeamId = linkTeam;
          console.debug('team', this.team);

          this.teamService.addTeam(this.team).subscribe(() => {
            this.navCtrl.pop();
            this.translateService.get('team.messages.createDone').subscribe(
              value => {
                this.presentToast(value);
              }
            )
          });
        });
      } else {
        console.debug('team', this.team);
        this.teamService.updateTeam(this.team).subscribe(() => {
          this.navCtrl.pop();
          this.translateService.get('team.messages.updateDone').subscribe(
            value => {
              this.presentToast(value);
            }
          )
        });
      }
    }
  }

  /**
   *
   * @param msg
   */
  private presentToast(msg) {
      let toast = this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'bottom'
      });

      toast.onDidDismiss(() => {
      });

      toast.present();
  }

    
}
