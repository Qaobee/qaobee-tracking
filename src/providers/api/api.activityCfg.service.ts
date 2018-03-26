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
import {ApiService} from "./api";
import {App, ToastController} from "ionic-angular";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ENV} from "@app/env";
import {catchError} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ActivityCfgService extends ApiService {
    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {TranslateService} translate
     * @param {HttpClient} http
     */
    constructor(app: App,
                authenticationService: AuthenticationService,
                toastCtrl: ToastController,
                private translate: TranslateService,
                private http: HttpClient) {
        super(app, authenticationService, toastCtrl);
    }

    /**
     *
     * @param {string} activityId
     * @returns {Observable<any>}
     */
    get(activityId: string) {
        return this.http.get<any>(ENV.hive + this.rootPath + '/commons/settings/activitycfg/get?activityId=' + activityId, this.addHeaderToken()).pipe(
            catchError(this.handleError('ActivityCfgService.get'))
        );
    }

    /**
     *
     * @param {string} activityId
     * @param {string} params
     */
    getParamFieldList(activityId: string, params: string) {
        return new Observable<any>((observer) => {
            this.translate.get('country').subscribe(
                value => {
                    console.log(value)
                    this.http.get<any[]>(ENV.hive + this.rootPath + '/commons/settings/activitycfg/params?paramFieldList=' + params + '&activityId=' + activityId + '&date=' + (new Date().getTime()) + '&countryId=' + value, this.addHeaderToken()).pipe(
                        catchError(this.handleError('ActivityCfgService.getParamFieldList'))
                    ).subscribe(data => {
                        observer.next(data);
                        observer.complete();
                    });
                });
        });
    }
}