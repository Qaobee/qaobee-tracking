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
import {Component} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {EventsService} from "../../../providers/api/api.events.service";
import {LocationService} from "../../../providers/location.service";
import {TeamService} from "../../../providers/api/api.team.service";
import {AuthenticationService} from "../../../providers/authentication.service";
import {ActivityCfgService} from "../../../providers/api/api.activityCfg.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import moment from 'moment';


/**
 * Generated class for the EventListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-event-upsert',
    templateUrl: 'event-upsert.html',
})
export class EventUpsertPage {
    editMode: string;
    eventForm: FormGroup;
    event: any;

    startDate: string;
    startTime: string;
    address: any;
    autocompleteItems = [];
    teams: any = {
        myTeams: [],
        adversaries: []
    };
    adversaryTeam: any;
    myTeam: any;
    radioHome: boolean;
    
    eventTypes: any[] = [];
    minDate: string = new Date().toISOString();

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {EventsService} eventsService
     * @param {ToastController} toastCtrl
     * @param {FormBuilder} formBuilder
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {ActivityCfgService} activityCfgService
     * @param {LocationService} locationService
     * @param {TeamService} teamService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private eventsService: EventsService,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private activityCfgService: ActivityCfgService,
                private locationService: LocationService,
                private teamService: TeamService,
                private translateService: TranslateService) {

        //Mode edit CREATE or UPDATE
        this.editMode = navParams.get('editMode');
        if(this.editMode && this.editMode==='CREATE') {
            this.event = {
                participants: {},
                activityId: this.authenticationService.meta.activity._id,
                seasonCode: this.authenticationService.meta.season.code,
            };
            this.startDate = moment().format("YYYY-MM-DD");
            this.startTime = moment().format("HH:mm");
            this.radioHome = true;

        } else {
            this.event = navParams.get('event');
            if (this.event && this.event.startDate) {
                this.startDate = moment(this.event.startDate).format("YYYY-MM-DD");
                this.startTime = moment(this.event.startDate).format("HH:mm");
                if (this.event.address && this.event.address.formatedAddress) {
                    this.address = this.event.address.formatedAddress;
                }

                //Maangement myteam vs adversaryTeam and teamHome Vs teamVisitor
                if(this.event.participants.teamHome._id===this.event.owner.teamId) {
                    this.radioHome = true;
                    this.myTeam = this.event.participants.teamHome;
                    this.adversaryTeam = this.event.participants.teamVisitor;
                } else {
                    this.radioHome = false;
                    this.myTeam = this.event.participants.teamVisitor;
                    this.adversaryTeam = this.event.participants.teamHome;
                }
            }
        }
        
        this.eventForm = this.formBuilder.group({
            'label': [this.event.label || '', [Validators.required]],
            'address': [this.address || ''],
            'startTime': [this.startTime, [Validators.required]],
            'startDate': [this.startDate, [Validators.required]],
            'type': [this.event.type, [Validators.required]],
            'myTeam': [this.myTeam, [Validators.required]],
            'adversaryTeam': [this.adversaryTeam, [Validators.required]],
            'radioHome': [this.radioHome, [Validators.required]],
        });

        // My team list
        this.teamService.getTeams(authenticationService.meta.effectiveDefault, authenticationService.meta._id, 'all', 'false').subscribe((teams: any[]) => {
            if (teams) {
                this.teams.myTeams = teams;
                if (teams.length === 1 && !this.event.participants.teamHome) {
                    this.event.participants.teamHome = teams[0];
                    this.eventForm.controls['myTeam'].setValue(teams[0]);
                }
            }
        });

        // Adversary team list
        this.teamService.getTeams(authenticationService.meta.effectiveDefault, authenticationService.meta._id, 'all', 'true').subscribe((teams: any[]) => {
            if (teams) {
                this.teams.adversaries = teams;
                if (teams.length === 1 && !this.event.participants.teamVisitor) {
                    this.event.participants.teamVisitor = teams[0];
                    this.eventForm.controls['adversaryTeam'].setValue(teams[0]);
                }
            }
        });
        this.activityCfgService.getParamFieldList(authenticationService.meta.activity._id, 'listEventType').subscribe((types: any[]) => {
            if (types) {
                this.eventTypes = types;
                if (types.length === 1) {
                    this.event.type = types[0];
                    this.eventForm.controls['type'].setValue(this.event.type);
                }
            }
        });
    }

    /**
     * Match element in option list from select input
     * @param e1 
     * @param e2 
     */
    compareOptionTypeEvent(e1: any, e2: any): boolean {
        return e1 && e2 ? e1.code === e2.code : e1 === e2;
    }

    /**
     * Match element in option list from select input
     * @param e1 
     * @param e2 
     */
    compareOptionTeam(e1: any, e2: any): boolean {
        return e1 && e2 ? e1._id === e2._id : e1 === e2;
    }

    /**
     *
     */
    updateSearchResults() {
        this.locationService.updateSearchResults(this.eventForm.controls['address'].value, result => {
            this.autocompleteItems = result;
        });
    }

    isValid(field: string) {
        let formField = this.eventForm.controls[field];
        return formField.valid || formField.pristine;
    }

    /**
     *
     * @param item
     */
    selectSearchResult(item) {
        this.autocompleteItems = [];
        this.eventForm.controls['address'].setValue(item.description);
        this.locationService.selectSearchResult(item, this.address, result => {
            this.event.address = {
                formatedAddress: item.description,
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
            };
        });
    }

    /**
     * 
     * @param formVal 
     */
    saveEvent(formVal) {
        if(this.eventForm.valid) {
            //event label
            this.event.label = formVal.label;

            //Date event
            let startDate = moment(formVal.startDate,"YYYY-MM-DD");
            let startTime = moment(formVal.startTime,"HH:mm");
            startDate.hour(startTime.hour());
            startDate.minute(startTime.minute());
            this.event.startDate = startDate.unix()*1000;
            
            //link event
            this.event.link = {
                linkId: 'AAAA',
                type: formVal.type.code
            };
            
            //eventType
            this.event.type = formVal.type;

            //event owner
            this.event.owner = {
                sandboxId: this.authenticationService.meta._id,
                effectiveId: this.authenticationService.meta.effectiveDefault,
                teamId: formVal.myTeam._id
            };

            //event participants
            if (formVal.radioHome) {
                this.event.participants.teamVisitor = formVal.adversaryTeam;
                this.event.participants.teamHome = formVal.myTeam;
            } else {
                this.event.participants.teamHome = formVal.adversaryTeam;
                this.event.participants.teamVisitor = formVal.myTeam;
            }

            //call API
            this.eventsService.addEvent(this.event).subscribe(r => {

                if(this.editMode==='CREATE'){
                  this.storage.get('events').then(events => {
                    events.push(r);
                    this.storage.set('events', events);
                    this.navCtrl.pop();
                    this.translateService.get('eventsModule.messages.createDone').subscribe(
                      value => {
                        this.presentToast(value);
                      }
                    )
                  });
                } else {
                  this.navCtrl.pop();
                  this.translateService.get('eventsModule.messages.updateDone').subscribe(
                    value => {
                      this.presentToast(value);
                    }
                  )
                }
            });
        }
    }

    cancel() {
        this.navCtrl.pop();
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
