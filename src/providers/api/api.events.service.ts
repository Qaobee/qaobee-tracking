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
import {Observable} from "rxjs/Observable";

@Injectable()
export class EventsService extends ApiService {
    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {HttpClient} http
     * @returns {Observable<any>}
     */
    constructor(app: App,
                authenticationService: AuthenticationService,
                toastCtrl: ToastController,
                private http: HttpClient) {
        super(app, authenticationService, toastCtrl);
    }

    getEvents(startDate:number, endDate:number, type:string, activityId:string, sandboxId:string): Observable<any> {
        let request = {
            startDate: startDate,
            endDate: endDate,
            activityId: activityId,
            ownersandboxId: sandboxId
        };
        if (type) {
            request['link.type'] = type;
        }
        return this.http.post<any>(ENV.hive + this.rootPath + '/sandbox/event/event/list', request, this.addHeaderToken()).pipe(
            catchError(this.handleError('EventsService.getEvents'))
        );
    }

    /**
     *
     * @param event
     * @returns {Observable<any>}
     */
    addEvent(event: any): Observable<any> {
        return this.http.post<any>(ENV.hive + this.rootPath + '/sandbox/event/event/add', event, this.addHeaderToken()).pipe(
            catchError(this.handleError('EventsService.addEvent'))
        );
    }

}