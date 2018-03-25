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
import {ActionSheetController, LoadingController, ToastController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {UserService} from "../../providers/api/api.user.service";
import {ENV} from '@app/env'
import {AuthenticationService} from "../../providers/authentication.service";

declare var google;

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {

    imageURI: any;
    imageFileName: any;
    user: any;
    address: string;
    root: string = ENV.hive;
    GoogleAutocomplete: any = new google.maps.places.AutocompleteService();
    geocoder: any = new google.maps.Geocoder;
    autocompleteItems = [];
    private birthdate: any;

    /**
     *
     * @param {Camera} camera
     * @param {LoadingController} loadingCtrl
     * @param {ToastController} toastCtrl
     * @param {ActionSheetController} actionSheetCtrl
     * @param {AuthenticationService} authenticationService
     * @param {UserService} userService
     */
    constructor(private camera: Camera,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private  actionSheetCtrl: ActionSheetController,
                private authenticationService: AuthenticationService,
                private userService: UserService) {
    }

    updateSearchResults() {
        if (!this.address || this.address == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({input: this.address},
            (predictions, status) => {
                this.autocompleteItems = [];
                predictions.forEach((prediction) => {
                    this.autocompleteItems.push(prediction);
                });
            });
    }

    selectSearchResult(item) {
        this.autocompleteItems = [];
        this.address = item.description;
        this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
            if (status === 'OK' && results[0]) {
                console.log(results[0])
                this.user.address = {
                    formatedAddress: item.description,
                    place: results[0].address_components[0].long_name + ', ' + results[0].address_components[1].long_name,
                    zipcode: results[0].address_components[6].long_name,
                    city: results[0].address_components[2].long_name,
                    country: results[0].address_components[5].long_name,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                };
            }
        })
    }

    getImage() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Choose source',
            buttons: [
                {
                    text: 'Gallery',
                    icon: 'image',
                    handler: () => {
                        this.captureImage({
                            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                            destinationType: this.camera.DestinationType.FILE_URI,
                            quality: 100,
                            encodingType: this.camera.EncodingType.JPEG,
                            correctOrientation: true
                        });
                    }
                }, {
                    text: 'Camera',
                    icon: 'camera',
                    handler: () => {
                        this.captureImage({
                            quality: 100,
                            destinationType: this.camera.DestinationType.DATA_URL,
                            encodingType: this.camera.EncodingType.JPEG,
                            mediaType: this.camera.PictureSourceType.CAMERA
                        });
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

    captureImage(options: CameraOptions) {
        this.camera.getPicture(options).then((imageData) => {
            this.imageURI = imageData;
            this.uploadFile();
        }, (err) => {
            console.log(err);
            this.presentToast(err);
        });
    }

    uploadFile() {
        let loader = this.loadingCtrl.create({
            content: 'Uploading...'
        });
        loader.present();
        this.userService.postAvatar(this.imageURI).then((data) => {
            console.log(data + " Uploaded Successfully");
            this.userService.getCurrentUser().subscribe((u: any) => {
                this.imageFileName = ENV.hive + '/file/User/' + u.avatar;
                loader.dismiss();
                this.presentToast("Image uploaded successfully");
            });

        }, (err) => {
            console.log(err);
            loader.dismiss();
            this.presentToast(err);
        });
    }
    saveProfile() {
        if(this.birthdate) {
            this.user.birthdate = Date.parse(this.birthdate)
        }
        let loader = this.loadingCtrl.create({
            content: 'Uploading...'
        });
        loader.present();
        this.userService.updateUser(this.user).subscribe(r => {
            this.userService.getCurrentUser().subscribe((u: any) => {
                this.imageFileName = ENV.hive + '/file/User/' + u.avatar;
                this.user = u;
                this.birthdate = new Date(this.user.birthdate);
                loader.dismiss();
                this.presentToast("User updated successfully");
            });
        })
    }

    ionViewDidLoad(): void {
        this.user = this.authenticationService.user;
        this.birthdate = new Date(this.user.birthdate).toISOString();
        if (this.user.address && this.user.address.formatedAddress) {
            this.address = this.user.address.formatedAddress;
        }
    }

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
