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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-team-upsert',
    templateUrl: 'team-upsert.html',
})
export class TeamUpsertPage {
    editMode: string;
    team: any;
    teamForm: FormGroup;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {ToastController} toastCtrl
     * @param {FormBuilder} formBuilder
     * @param {GoogleAnalytics} ga
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private ga: GoogleAnalytics) {
        this.editMode = navParams.get('editMode');
        if (this.editMode && this.editMode === 'CREATE') {
            this.team = {
            };

        } else {
            this.team = navParams.get('team');
        }

        this.teamForm = this.formBuilder.group({
            'name': [ this.team.name || '', [ Validators.required ] ]
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
    static compareOptionSelect(e1: any, e2: any): boolean {
        return e1 && e2 ? (e1 === e2.code || e1.code === e2.code) : e1 === e2;
    }

    /**
     *
     * @param {string} field
     * @returns {boolean}
     */
    isValid(field: string) {
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
