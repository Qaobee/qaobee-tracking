import { ApiService } from './api';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "@app/env";
import { catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import moment from 'moment';

@Injectable()
export class ActivityCfgService {
    /**
     * @param {TranslateService} translate
     * @param {HttpClient} http
     * @param {ApiService} apiService
     */
    constructor(
        private translate: TranslateService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
    }

    /**
     *
     * @param {string} activityId
     * @returns {Observable<any>}
     */
    get(activityId: string) {
        return new Observable<any>((observer) => {
            this.translate.get('country').subscribe(value => {
                this.http.get<any>(ENV.hive + this.apiService.rootPath + '/commons/settings/activitycfg/get?activityId=' + activityId
                    + '&date=' + moment.utc().valueOf()
                    + '&countryId=' + value, this.apiService.addHeaderToken()).pipe(
                        catchError(this.apiService.handleError('ActivityCfgService.get'))
                    ).subscribe(data => {
                        observer.next(data);
                        observer.complete();
                    });
            });
        });
    }

    /**
     *
     * @param {string} activityId
     * @param {string} params
     */
    getParamFieldList(activityId: string, params: string) {
        return new Observable<any>((observer) => {
            this.translate.get('country').subscribe(value => {
                this.http.get<any[]>(ENV.hive + this.apiService.rootPath + '/commons/settings/activitycfg/params?paramFieldList=' + params
                    + '&activityId=' + activityId
                    + '&date=' + moment.utc().valueOf() + '&countryId=' + value, this.apiService.addHeaderToken()).pipe(
                        catchError(this.apiService.handleError('ActivityCfgService.getParamFieldList'))
                    ).subscribe(data => {
                        observer.next(data);
                        observer.complete();
                    });
            });
        });
    }
}