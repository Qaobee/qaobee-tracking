import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { ActivityCfgService } from '../../../providers/api/api.activityCfg.service';
import { AuthenticationService } from "../../../providers/authentication.service";
import { EffectiveService } from '../../../providers/api/api.effective.service';
import { LocationService } from "../../../providers/location.service";
import { PersonService } from '../../../providers/api/api.person.service';

import moment from 'moment';
import { GoogleAnalytics } from "@ionic-native/google-analytics";


@Component({
    selector: 'page-player-upsert',
    templateUrl: 'player-upsert.html',
})
export class PlayerUpsertPage {
    editMode: string;
    player: any;
    listPositionType: any[] = [];
    listLaterality: any[] = [];
    playerForm: FormGroup;
    address: any;
    autocompleteItems = [];
    maxDate: string = new Date().toISOString();
    birthdatePlayer: string = '';

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {ToastController} toastCtrl
     * @param {FormBuilder} formBuilder
     * @param {ActivityCfgService} activityCfgService
     * @param {AuthenticationService} authenticationService
     * @param {PersonService} personService
     * @param {LocationService} locationService
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
                private personService: PersonService,
                private locationService: LocationService,
                private effectiveService: EffectiveService,
                private storage: Storage,
                private translateService: TranslateService,
                private ga: GoogleAnalytics) {
        this.editMode = navParams.get('editMode');
        if (this.editMode && this.editMode === 'CREATE') {
            this.player = {
                status: {},
                contact: {},
            };

            this.birthdatePlayer = '';

        } else {
            this.player = navParams.get('player');

            if (!this.player.contact) {
                this.player.contact = {};
            }

            if (!this.player.status) {
                this.player.status = {};
            }

            if (this.player.birthdate) {
                this.birthdatePlayer = moment(this.player.birthdate).format("YYYY-MM-DD");
            }

            if (this.player.address && this.player.address.formatedAddress) {
                this.address = this.player.address.formatedAddress;
            }
        }

        this.playerForm = this.formBuilder.group({
            'name': [ this.player.name || '', [ Validators.required ] ],
            'firstname': [ this.player.firstname || '', [ Validators.required ] ],
            'squadnumber': [ this.player.status.squadnumber || '', [ Validators.required ] ],
            'positionType': [ this.player.status.positionType, [ Validators.required ] ],
            'laterality': [ this.player.status.laterality, [ Validators.required ] ],
            'weight': [ this.player.status.weight || '' ],
            'height': [ this.player.status.height || '' ],
            'birthdate': [ this.birthdatePlayer ],
            'nationality': [ this.player.nationality || '' ],
            'mobile': [ this.player.contact.cellphone || '' ],
            'email': [ this.player.contact.email || '' ],
            'address': [ this.address || '' ]
        });


        this.activityCfgService.getParamFieldList(authenticationService.meta.activity._id, 'listPositionType').subscribe((listPositionType: any[]) => {
            if (listPositionType) {
                this.listPositionType = listPositionType;
            }
        });

        this.activityCfgService.getParamFieldList(authenticationService.meta.activity._id, 'listLaterality').subscribe((listLaterality: any[]) => {
            if (listLaterality) {
                this.listLaterality = listLaterality;
            }
        });
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('PlayerUpsertPage');
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
        let formField = this.playerForm.controls[ field ];
        return formField.valid || formField.pristine;
    }

    /**
     *
     */
    updateSearchResults() {
        this.locationService.updateSearchResults(this.playerForm.controls[ 'address' ].value, result => {
            this.autocompleteItems = result;
        });
    }

    /**
     *
     * @param item
     */
    selectSearchResult(item) {
        this.autocompleteItems = [];
        this.playerForm.controls[ 'address' ].setValue(item.description);
        this.locationService.selectSearchResult(item, this.address, result => {
            this.player.address = {
                formatedAddress: item.description,
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
            };
        });
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
    savePlayer(formVal) {
        if (this.playerForm.valid) {
            //civil status
            this.player.name = formVal.name;
            this.player.firstname = formVal.firstname;
            this.player.birthdate = moment(formVal.birthdate).valueOf();
            this.player.nationality = formVal.nationality;

            //status player
            this.player.status = {};
            if (formVal.weight) {
                this.player.status.weight = formVal.weight;
            }
            if (formVal.height) {
                this.player.status.height = formVal.height;
            }
            if (formVal.squadnumber) {
                this.player.status.squadnumber = formVal.squadnumber;
            }
            if (formVal.positionType) {
                this.player.status.positionType = formVal.positionType;
            }
            if (formVal.laterality) {
                this.player.status.laterality = formVal.laterality;
            }

            //player contact
            this.player.contact = {};
            if (formVal.mobile) {
                this.player.contact.cellphone = formVal.mobile;
            }

            if (formVal.email) {
                this.player.contact.email = formVal.email;
            }

            this.player.address = {};
            if (formVal.address) {
                this.player.address.formatedAddress = formVal.address;
            }

            //sandboxId
            this.player.sandboxId = this.authenticationService.meta._id;

            console.log('Player', this.player);

            let dataContainer = {person: this.player};
            this.personService.addPerson(dataContainer).subscribe(r => {

                if (this.editMode === 'CREATE') {
                    this.storage.get(this.authenticationService.meta._id + '-players').then(players => {
                        players.push(r);
                        this.storage.set(this.authenticationService.meta._id + '-players', players);

                        this.effectiveService.get(this.authenticationService.meta.effectiveDefault).subscribe(effectiveGet => {
                            console.log('effectiveGet', effectiveGet);
                            let effective: any;
                            effective = effectiveGet;
                            if (effective) {
                                let roleMember = {code: 'player', label: 'Joueur'};
                                let member = {personId: r._id, role: roleMember};

                                if (effective) {
                                    effective.members.push(member);
                                } else {
                                    effective.members = [];
                                    effective.members.push(member);
                                }

                                /* Update effective members list */
                                this.effectiveService.update(effective).subscribe(effectiveUpdate => {
                                    console.debug('[PlayerUpsertPage] - savePlayer - update', effectiveUpdate);
                                    this.navCtrl.pop();
                                    this.translateService.get('player.messages.createDone').subscribe(
                                        value => {
                                            this.presentToast(value);
                                        }
                                    )
                                });
                            }
                        });
                    });
                } else {
                    this.navCtrl.pop();
                    this.translateService.get('player.messages.updateDone').subscribe(
                        value => {
                            this.presentToast(value);
                        }
                    )
                }
            });
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
