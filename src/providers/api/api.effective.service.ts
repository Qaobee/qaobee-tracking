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
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/effective/get?_id=' + effectiveId, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }

    /**
     * @param  {string} sandboxconfigId
     */
    getList(sandboxconfigId: string) {
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/effective/getList?sandboxId=' + sandboxconfigId, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }

    /**
     * @param  {any} effective
     */
    update(effective: any) {
        return this.http.put<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/effective/update', effective, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }
}