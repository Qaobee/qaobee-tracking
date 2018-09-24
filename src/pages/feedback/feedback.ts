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

import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, NavController, NavParams } from "ionic-angular";
import { Device } from '@ionic-native/device';
import * as html2canvas from "html2canvas"
import 'fabric'
import { CommonService } from "../../providers/api/api.common.service";
import { AuthenticationService } from "../../providers/authentication.service";
import { TranslateService } from "@ngx-translate/core";

declare let fabric: any;

/**
 * Generated class for the FeedbackComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'feedback',
    templateUrl: 'feedback.html'
})
export class FeedbackComponent {
    @ViewChild('imgElem') imgElem: ElementRef;
    @ViewChild('screenshot') screenshot: ElementRef;
    img: string;
    url: string;
    comment = '';

    /**
     *
     * @param navCtrl
     * @param navParams
     * @param device
     * @param commonService
     * @param translate
     * @param alertCtrl
     * @param authenticationService
     */
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private device: Device,
        private commonService: CommonService,
        private translate: TranslateService,
        public alertCtrl: AlertController,
        private authenticationService: AuthenticationService
    ) {
        this.img = navParams.get('img');
        this.url = navParams.get('url');
    }

    ionViewDidEnter() {
        const canvas = new fabric.Canvas('sheet');
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 5;
        canvas.freeDrawingBrush.color = "#ff0000";
        canvas.setWidth(this.imgElem.nativeElement.width);
        canvas.setHeight(this.imgElem.nativeElement.height);
        canvas.renderAll();
    }

    send() {
        html2canvas(this.screenshot.nativeElement).then((c) => {
            this.commonService.sendFeedback({
                img: c.toDataURL(),
                meta: {user: this.authenticationService.user},
                note: this.comment,
                url: this.url,
                browser: this.device
            }).subscribe(r => {
                console.debug(r);
                this.translate.get(['feedback', 'actionButton'] ).subscribe((t) => {
                    const alert = this.alertCtrl.create({
                        title: t.feedback.title.title,
                        subTitle: t.feedback.done,
                        buttons: [ {
                            text: t.actionButton.Ok,
                            handler: () => {
                                this.navCtrl.pop();
                            }
                        } ]
                    });
                    alert.present();
                });
            });
        });
    }

}
