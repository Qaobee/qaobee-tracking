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
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {EventsService} from "../../../providers/api/api.events.service";
import {LocationService} from "../../../providers/location.service";
import {TeamService} from "../../../providers/api/api.team.service";
import {AuthenticationService} from "../../../providers/authentication.service";
import {ActivityCfgService} from "../../../providers/api/api.activityCfg.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";

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
    eventForm: FormGroup;
    event: any;
    startDate: string = new Date().toISOString();
    startTime: string = new Date().toISOString();
    address: any;
    autocompleteItems = [];
    teams: any = {
        myTeams: [],
        adversaries: []
    };
    teamVisitor: any;
    teamHome: any;
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
                private teamService: TeamService) {

        this.event = navParams.get('event') || {
            participants: {},
            activityId: this.authenticationService.meta.activity._id,
            seasonCode: this.authenticationService.meta.season.code,
        };
        if (this.event && this.event.startDate) {
            this.startDate = new Date(this.event.startDate / 1000).toISOString();
            this.startTime = this.startDate;
            if (this.event.address && this.event.address.formatedAddress) {
                this.address = this.event.address.formatedAddress;
            }
        }

        this.eventForm = this.formBuilder.group({
            'label': [this.event.label || '', [Validators.required]],
            'address': [this.address || ''],
            'startTime': [this.startTime, [Validators.required]],
            'startDate': [this.startTime, [Validators.required]],
            'type': [this.event.type, [Validators.required]],
            'teamVisitor': [this.event.participants.teamVisitor, [Validators.required]],
            'teamHome': [this.event.participants.teamHome, [Validators.required]],
            'radioHome': [true, [Validators.required]],
        });

        this.teamService.getTeams(authenticationService.meta.effectiveDefault, authenticationService.meta._id, 'all', 'false').subscribe((teams: any[]) => {
            if (teams) {
                this.teams.myTeams = teams;
                if (teams.length === 1 && !this.event.participants.teamHome) {
                    this.event.participants.teamHome = teams[0];
                    this.teamHome = teams[0];
                    this.eventForm.controls['teamHome'].setValue(this.teamHome);
                }
            }
        });

        this.teamService.getTeams(authenticationService.meta.effectiveDefault, authenticationService.meta._id, 'all', 'true').subscribe((teams: any[]) => {
            if (teams) {
                this.teams.adversaries = teams;
                if (teams.length === 1 && !this.event.participants.teamVisitor) {
                    this.event.participants.teamVisitor = teams[0];
                    this.teamVisitor = teams[0];
                    this.eventForm.controls['teamVisitor'].setValue(this.teamVisitor);
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
    compareOptionSelect(e1: any, e2: any): boolean {
        return e1 && e2 ? (e1 === e2.code || e1.code === e2.code) : e1 === e2;
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
                place: result.address_components[0].long_name + ', ' + result.address_components[1].long_name,
                zipcode: result.address_components[6].long_name,
                city: result.address_components[2].long_name,
                country: result.address_components[5].long_name,
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
            };
        });
    }

    /**
     *
     */
    saveEvent(formVal) {
        if(this.eventForm.valid) {
            console.log('[EventUpsertPage] - saveEvent - formVal', formVal);
            let startDate = new Date(formVal.startDate);
            let startTime = new Date(formVal.startTime);
            this.event.startDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), startTime.getUTCHours(), startTime.getUTCMinutes()).getTime();
            this.event.endDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), startTime.getUTCHours() + 1, startTime.getUTCMinutes()).getTime();
            this.event.link = {
                linkId: 'AAAA',
                type: formVal.type.code
            };
            this.event.label = formVal.label;
            this.event.type = formVal.type;
            this.event.owner = {
                sandboxId: this.authenticationService.meta._id,
                effectiveId: this.authenticationService.meta.effectiveDefault,
                teamId: this.event.participants.teamHome._id
            };
            if (formVal.radioHome) {
                this.event.participants.teamVisitor = formVal.teamVisitor;
                this.event.participants.teamHome = formVal.teamHome;
            } else {
                this.event.participants.teamHome = formVal.teamVisitor;
                this.event.participants.teamVisitor = formVal.teamHome;
            }
            console.log('[EventUpsertPage] - saveEvent - this.event', this.event);
            this.eventsService.addEvent(this.event).subscribe(r => {
                console.log('[EventUpsertPage] - saveEvent', r);
                this.storage.get('events').then(events => {
                    events.push(r);
                    this.storage.set('events', events);
                    this.navCtrl.pop();
                    // TODO i18n
                    this.presentToast('Event created');
                });
            });
        }
    }

    cancel() {
        console.log('[EventUpsertPage] - cancel');
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
            console.log('Dismissed toast');
        });

        toast.present();
    }
}
