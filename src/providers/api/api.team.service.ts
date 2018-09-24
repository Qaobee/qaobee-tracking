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

import { ApiService } from "./api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "@app/env";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Injectable()
export class TeamService {
    /**
     *
     * @param {ApiService} apiService
     * @param {HttpClient} http
     */
    constructor(
        private apiService: ApiService,
        private http: HttpClient) {
    }

    /**
     *
     * @param {string} effectiveId
     * @param {string} sandboxId
     * @param {string} enable
     * @param {string} adversary
     * @returns {Observable<any>}
     */
    getTeams(effectiveId: string, sandboxId: string, enable: string, adversary: string): Observable<any> {
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/team/list?enable=' + enable + '&adversary=' + adversary + '&effectiveId=' + effectiveId + '&sandboxId=' + sandboxId, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('TeamService.getTeams'))
        );
    }

    /**
     * add team
     * @param team
     * @returns {Observable<any>}
     */
    addTeam(team: any): Observable<any> {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/team/add', team, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('TeamService.addTeam'))
        );
    }

    /**
     * update team
     * @param team
     * @returns {Observable<any>}
     */
    updateTeam(team: any): Observable<any> {
        return this.http.put<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/team/update', team, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('TeamService.updateTeam'))
        );
    }
}