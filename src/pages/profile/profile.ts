import {Component} from '@angular/core';
import {ActionSheetController, LoadingController, ToastController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {UserService} from "../../providers/api/user.service";
import {ENV} from '@app/env'
import {AuthenticationService} from "../../providers/authentication.service";

declare var google;

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
        if (this.user.address.formattedAddress == '') {
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
                this.user.address = {
                    formatedAddress: item.description,
                    place: results[0].address_components[0].long_name + ', ' + results[0].address_components[1].long_name,
                    zipcode: results[0].address_components[6].long_name,
                    city: results[0].address_components[2].long_name,
                    country: results[0].address_components[5].long_name,
                    lat: results[0].geometry.location.lat,
                    lng: results[0].geometry.location.lng,
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
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    captureImage(options: CameraOptions) {
        this.camera.getPicture(options).then((imageData) => {
            this.imageURI = imageData;
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

    ionViewDidLoad() {
        this.user = this.authenticationService.user;
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
