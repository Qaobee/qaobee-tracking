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

@Injectable()
export class TeamService extends ApiService {
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
                private http: HttpClient) {
        super(app, authenticationService, toastCtrl);
    }

    /**
     *
     * @param {string} effectiveId
     * @param {string} sandboxId
     * @param {string} enable
     * @param {string} adversary
     * @returns {Observable<any>}
     */
    getTeams(effectiveId: string, sandboxId: string, enable: string, adversary: string) {
        return this.http.get<any>(ENV.hive + this.rootPath + '/sandbox/effective/team/list?enable=' + enable + '&adversary=' + adversary + '&effectiveId=' + effectiveId + '&sandboxId=' + sandboxId, this.addHeaderToken()).pipe(
            catchError(this.handleError('TeamService.getTeams'))
        );
    }

    /**
     *
     * @param team
     * @returns {Observable<any>}
     */
    addTeam(team: any) {
        return this.http.post<any>(ENV.hive + this.rootPath + '/sandbox/effective/team/add', team, this.addHeaderToken()).pipe(
            catchError(this.handleError('TeamService.addTeam'))
        );
    }
}