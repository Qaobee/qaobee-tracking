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

import { ActivityCfgService } from '../../../providers/api/api.activityCfg.service';
import { AuthenticationService } from "../../../providers/authentication.service";
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { EffectiveService } from '../../../providers/api/api.effective.service';
import { TeamService } from '../../../providers/api/api.team.service';
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-team-upsert',
    templateUrl: 'team-upsert.html',
})
export class TeamUpsertPage {
    editMode: string;
    adversary: boolean;
    team: any;
    teamForm: FormGroup;
    listCategoryAge: any[] = [];

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {ToastController} toastCtrl
     * @param {ActivityCfgService} activityCfgService
     * @param {AuthenticationService} authenticationService
     * @param {TeamService} teamService
     * @param {FormBuilder} formBuilder
     * @param {EffectiveService} effectiveService
     * @param {Storage} storage
     * @param {TranslateService} translateService
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private activityCfgService: ActivityCfgService,
                private authenticationService: AuthenticationService,
                private teamService: TeamService,
                private effectiveService: EffectiveService,
                private storage: Storage,
                private translateService: TranslateService,
                private ga: GoogleAnalytics) {
        
        this.editMode = navParams.get('editMode');
        this.adversary = navParams.get('adversary')

        if (this.editMode && this.editMode === 'CREATE') {
            this.team = {
              categoryAge: {},
            };

        } else {
            this.team = navParams.get('team');
        }

        console.debug('adversary',this.adversary);

        //Initialiaze team's form
        this.teamForm = this.formBuilder.group({
            'label': [ this.team.label|| '', [ Validators.required ] ],
            'championship': [ this.team.championship|| '', [ Validators.required ] ],
            'categoryAge': [ this.team.categoryAge, [ Validators.required ] ]
        });

        //Get list of categoryAge
        this.activityCfgService.getParamFieldList(authenticationService.meta.activity._id, 'listCategoryAge').subscribe((listCategoryAge: any[]) => {
            if (listCategoryAge) {
                this.listCategoryAge = listCategoryAge;
            }
        });
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('TeamUpsertPage');
    }

    /**
     * Match element in option list from select input
     * @param e1
     * @param e2
     */
    compareOptionSelect(e1: any, e2: any): boolean {
        return e1 && e2 ? (e1 === e2.code || e1.code === e2.code) : e1 === e2;
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
    saveTeam(formVal) {

        if (this.teamForm.valid) {
          this.team.label = formVal.label;
          this.team.championship = formVal.championship;
          
          if (formVal.categoryAge) {
              this.team.categoryAge = formVal.categoryAge;
          }

          if (this.editMode === 'CREATE') {
            this.team.adversary = this.adversary;
            this.team.enable = true;
            
            //sandboxId
            this.team.sandboxId = this.authenticationService.meta._id;

            // retrieve effective Id
            this.effectiveService.get(this.authenticationService.meta.effectiveDefault).subscribe(effectiveGet => {
              let effective: any = effectiveGet;
              this.team.effectiveId = effective._id;
              console.debug('team', this.team);

              this.teamService.addTeam(this.team).subscribe(r => {
                this.storage.get(this.authenticationService.meta._id + '-teams').then(teams => {
                  teams.push(r);
                  this.storage.set(this.authenticationService.meta._id + '-teams', teams);
                  this.navCtrl.pop();
                  this.translateService.get('team.messages.createDone').subscribe(
                      value => {
                          this.presentToast(value);
                      }
                  )
                });
              });
            });
          } else {
            console.debug('team', this.team);
            this.teamService.updateTeam(this.team).subscribe(r => {
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
