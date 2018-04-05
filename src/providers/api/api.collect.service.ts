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
import { ApiService } from "./api";
import { App, ToastController } from "ionic-angular";
import { AuthenticationService } from "../authentication.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "@app/env";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import moment from 'moment';

@Injectable()
export class CollectService extends ApiService {
    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {HttpClient} http
     */
    constructor(app: App,
        authenticationService: AuthenticationService,
        toastCtrl: ToastController,
        private http: HttpClient
    ) {
        super(app, authenticationService, toastCtrl);
    }

    /**
     * @param  {any} collect
     */
    updateCollect(collect: any) {
        return this.http.post<any>(ENV.hive + this.rootPath +  '/sandbox/stats/collect/update', collect, this.addHeaderToken()).pipe(
            catchError(this.handleError('MetaServices.getMeta'))
        );
    }

    /**
     * @param  {any} collect
     */
    addCollect(collect: any) {
        return this.http.post<any>(ENV.hive + this.rootPath +  '/sandbox/stats/collect/add', collect, this.addHeaderToken()).pipe(
            catchError(this.handleError('MetaServices.getMeta'))
        );
    }
    /**
     * @param  {string} sandboxId
     * @param  {string} eventId
     * @param  {string} effectiveId
     * @param  {string} teamId
     * @param  {number} startDate
     * @param  {number} endDate
     */
    getCollects(sandboxId: string, eventId:string, effectiveId:string, teamId:string, startDate:number, endDate: number)  {
        let request = {
            eventId: eventId,
            effectiveId: effectiveId,
            teamId: teamId,
            sandboxId: sandboxId,
            startDate: startDate,
            endDate: endDate            
        }
        return this.http.post<any>(ENV.hive + this.rootPath +  '/sandbox/stats/collect/list', request, this.addHeaderToken()).pipe(
            catchError(this.handleError('MetaServices.getMeta'))
        );
    }
}