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
import {SettingsService} from "../../../providers/settings.service";
import {LocationService} from "../../../providers/location.service";
import {TeamService} from "../../../providers/api/api.team.service";
import {AuthenticationService} from "../../../providers/authentication.service";
import {ActivityCfgService} from "../../../providers/api/api.activityCfg.service";

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
    // TODO : mandatory fields and controls
    event: any;
    startDate: string = new Date().toISOString();
    startTime: string = new Date().toISOString();
    address: any;
    autocompleteItems = [];
    teams: any = {
        myTeams: [],
        adversaries: []
    };
    eventTypes: any[] = [];
    minDate: string = new Date().toISOString();
    radioHome: boolean = true;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {EventsService} eventsServices
     * @param {SettingsService} settingsService
     * @param {ToastController} toastCtrl
     * @param {AuthenticationService} authenticationService
     * @param {ActivityCfgService} activityCfgService
     * @param {LocationService} locationService
     * @param {TeamService} teamService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private eventsServices: EventsService,
                private settingsService: SettingsService,
                private toastCtrl: ToastController,
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
            this.startDate = new Date(this.event.startDate).toISOString();
            this.startTime = this.startDate;
            if (this.event.address && this.event.address.formatedAddress) {
                this.address = this.event.address.formatedAddress;
            }
        }

        teamService.getTeams(authenticationService.meta.effectiveDefault, authenticationService.meta._id, 'all', 'false').subscribe((teams:any[]) => {
            if (teams) {
                this.teams.myTeams = teams;
                if(teams.length === 1) {
                    this.event.participants.teamHome = teams[0];
                }
            }
        });

        teamService.getTeams(authenticationService.meta.effectiveDefault, authenticationService.meta._id, 'all', 'true').subscribe((teams:any[]) => {
            if (teams) {
                this.teams.adversaries = teams;
                if(teams.length === 1) {
                    this.event.participants.teamVisitor = teams[0];
                }
            }
        });
        activityCfgService.getParamFieldList(authenticationService.meta.activity._id, 'listEventType').subscribe((types:any[]) => {
            if (types) {
                this.eventTypes = types;
            }
        });
    }

    /**
     *
     */
    ionViewDidLoad() {
        console.log('[EventUpsertPage] - ionViewDidLoad', this.event);
    }

    /**
     *
     */
    updateSearchResults() {
        this.locationService.updateSearchResults(this.address, result => {
            this.autocompleteItems = result;
        });
    }

    /**
     *
     * @param item
     */
    selectSearchResult(item) {
        this.autocompleteItems = [];
        this.address = item.description;
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
    saveEvent() {
        this.event.startDate = Date.parse(this.startDate + ' ' + this.startTime).valueOf();
        console.log('[EventUpsertPage] - saveEvent', this.event);
    }

    cancel() {
        console.log('[EventUpsertPage] - cancel');
        this.navCtrl.pop();
    }

    /**
     *
     * @param msg
     */
    presentToast(msg) {
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
