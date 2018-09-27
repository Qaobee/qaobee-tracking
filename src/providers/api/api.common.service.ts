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

import { Observable } from 'rxjs/Observable';
import { ApiService } from "./api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "@app/env";
import { catchError } from "rxjs/operators";

@Injectable()
export class CommonService {
    /**
     *
     * @param {ApiService} apiService
     * @param {HttpClient} http
     */
    constructor(
        private http: HttpClient,
        private apiService: ApiService) {
    }

    /**
     *
     * @returns {Observable<any>}
     */
    sendFeedback(feedback:{}): Observable<any> {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/commons/feedback/send/mob',feedback).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }
}