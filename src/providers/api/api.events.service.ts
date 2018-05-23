import { ApiService } from "./api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "@app/env";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Injectable()
export class EventsService {
    /**
     *
     * @param {HttpClient} http
     * @param {ApiService} apiService
     * @returns {Observable<any>}
     */
    constructor(
        private http: HttpClient,
        private apiService: ApiService) {
    }

    getEvents(startDate: number, endDate: number, type: string, activityId: string, sandboxId: string): Observable<any> {
        let request = {
            startDate: startDate,
            endDate: endDate,
            activityId: activityId,
            ownersandboxId: sandboxId
        };
        if (type) {
            request[ 'link.type' ] = type;
        }
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/sandbox/event/event/list', request, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('EventsService.getEvents'))
        );
    }

    /**
     *
     * @param event
     * @returns {Observable<any>}
     */
    addEvent(event: any): Observable<any> {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/sandbox/event/event/add', event, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('EventsService.addEvent'))
        );
    }

}