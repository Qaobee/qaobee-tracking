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