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

@Injectable()
export class EffectiveService {
    /**
     *
     * @param {HttpClient} http
     * @param {ApiService} apiService
     */
    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {
    }

    /**
     * @param  {string} effectiveId
     */
    get(effectiveId: string) {
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/effective/get?_id=' + effectiveId).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }

    /**
     * @param  {string} sandboxconfigId
     */
    getList(sandboxconfigId: string) {
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/effective/getList?sandboxId=' + sandboxconfigId).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }

    /**
     * @param  {any} effective
     */
    update(effective: any) {
        return this.http.put<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/effective/update', effective).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }
}