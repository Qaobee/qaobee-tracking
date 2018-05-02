import { ENV } from '@app/env';
import { CollectStat } from './../../model/collect.stat';
import { ApiService } from "./api";
import { App, ToastController } from "ionic-angular";
import { AuthenticationService } from "../authentication.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";

@Injectable()
export class APIStatsService extends ApiService {
  private apiUrl: string;

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
    this.apiUrl = ENV.hive + this.rootPath;
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
    return this.http.post<any>(this.apiUrl + '/commons/settings/indicator/getByCode', request, this.addHeaderToken()).pipe(
      catchError(this.handleError('APIStatsService.getIndicatorCfg'))
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
    return this.http.post<any>(this.apiUrl + '/commons/settings/indicator/getList', request, this.addHeaderToken()).pipe(
      catchError(this.handleError('APIStatsService.getListIndicators'))
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
      if (stat.value && '' !== stat.value) {
        s.value = stat.intValue;
        delete s.intValue;
      }
      request.push(s);
    });
    return this.http.put<any>(this.apiUrl + '/sandbox/stats/statistics/addBulk', request, this.addHeaderToken()).pipe(
      catchError(this.handleError('APIStatsService.addBulk'))
    );
  }


  /**
   * Gets list for event.
   *
   * @param  {string} eventId
   */
  getListForEvent(eventId: string) {
    return this.http.get<any>(this.apiUrl + '/sandbox/stats/statistics/?eventId=' + eventId, this.addHeaderToken()).pipe(
      catchError(this.handleError('APIStatsService.getListForEvent'))
    );
  }

  /**
   * Gets stats group by
   * @param search
   * @returns {Observable<any>}
   */
  getStatGroupBy(search: any) {
    return this.http.post<any>(this.apiUrl + '/sandbox/stats/statistics/getStatGroupBy', search, this.addHeaderToken()).pipe(
      catchError(this.handleError('APIStatsService.getStatGroupBy'))
    );
  }

  /**
   * get List Detail Value
   * @param search
   * @returns {Observable<any>}
   */
  getListDetailValue(search: any) {
    return this.http.post<any>(this.apiUrl + '/sandbox/stats/statistics/getListDetailValue', search, this.addHeaderToken()).pipe(
      catchError(this.handleError('APIStatsService.getListDetailValue'))
    );
  }
}