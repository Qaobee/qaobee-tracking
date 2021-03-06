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

import { ENV } from '@app/env';
import { CollectStat } from '../../model/collect.stat';
import { ApiService } from "./api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";

@Injectable()
export class APIStatsService {
    private apiUrl: string;

    /**
     *
     * @param {ApiService} apiService
     * @param {HttpClient} http
     */
    constructor(
        private apiService: ApiService,
        private http: HttpClient) {
        this.apiUrl = ENV.hive + this.apiService.rootPath;
    }

    /**
     * Gets indicator cfg.
     *
     * @param  {string} activityId
     * @param  {string} countryId
     * @param  {string[]} listIndicators
     */
    getIndicatorCfg(activityId: string, countryId: string, listIndicators: string[]) {
        let request = {activityId: activityId, countryId: countryId, listIndicators: listIndicators};
        return this.http.post<any>(this.apiUrl + '/commons/settings/indicator/getByCode', request).pipe(
            catchError(this.apiService.handleError('APIStatsService.getIndicatorCfg'))
        );
    }


    /**
     * Gets indicators list.
     *
     * @param  {string} activityId
     * @param  {string} countryId
     * @param  {string[]} screen
     */
    getListIndicators(activityId: string, countryId: string, screen: string[]) {
        let request = {activityId: activityId, countryId: countryId, screen: screen};
        return this.http.post<any>(this.apiUrl + '/commons/settings/indicator/getList', request).pipe(
            catchError(this.apiService.handleError('APIStatsService.getListIndicators'))
        );
    }

    /**
     * Add bulk stats
     *
     * @param  {CollectStat[]} stats
     */
    addBulk(stats: CollectStat[]) {
        let request = [];
        stats.forEach(stat => {
            let s: any = stat;
            request.push(s);
        });
        return this.http.put<any>(this.apiUrl + '/sandbox/stats/statistics/addBulk', request).pipe(
            catchError(this.apiService.handleError('APIStatsService.addBulk'))
        );
    }


    /**
     * Gets list for event.
     *
     * @param  {string} eventId
     */
    getListForEvent(eventId: string) {
        return this.http.get<any>(this.apiUrl + '/sandbox/stats/statistics/?eventId=' + eventId).pipe(
            catchError(this.apiService.handleError('APIStatsService.getListForEvent'))
        );
    }

    /**
     * Gets stats group by
     * @param search
     * @returns {Observable<any>}
     */
    getStatGroupBy(search: any) {
        return this.http.post<any>(this.apiUrl + '/sandbox/stats/statistics/getStatGroupBy', search).pipe(
            catchError(this.apiService.handleError('APIStatsService.getStatGroupBy'))
        );
    }

    /**
     * get List Detail Value
     * @param search
     * @returns {Observable<any>}
     */
    getListDetailValue(search: any) {
        return this.http.post<any>(this.apiUrl + '/sandbox/stats/statistics/getListDetailValue', search).pipe(
            catchError(this.apiService.handleError('APIStatsService.getListDetailValue'))
        );
    }
}