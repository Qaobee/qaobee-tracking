import { Observable } from 'rxjs/Observable';
import { ApiService } from "./api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "@app/env";
import { catchError } from "rxjs/operators";

@Injectable()
export class MetaService {
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
    getMeta(): Observable<any> {
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/commons/users/user/meta', this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }

    /**
     *
     * @returns {Observable<any>}
     */
    getParams(): Observable<any> {
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/commons/settings/get', this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getParams'))
        );
    }

}