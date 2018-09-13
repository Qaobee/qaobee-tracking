import { ApiService } from "./api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "@app/env";
import { catchError } from "rxjs/operators";

@Injectable()
export class CollectService {
    /**
     * @param {HttpClient} http
     * @param {ApiService} apiService
     */
    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {
    }

    /**
     * @param  {any} collect
     */
    updateCollect(collect: any) {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/sandbox/stats/collect/update', collect, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }

    /**
     * @param  {any} collect
     */
    addCollect(collect: any) {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/sandbox/stats/collect/add', collect, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }

    /**
     * @param  {string} sandboxId
     * @param  {string} eventId
     * @param  {string} effectiveId
     * @param  {string} teamId
     * @param  {number} startDate
     * @param  {number} endDate
     */
    getCollects(sandboxId: string, eventId: string, effectiveId: string, teamId: string, startDate: number, endDate: number) {
        // FIXME : cette requête ne ramenera jamais une liste mais un seule collecte, car il n'y a qu'une collecte par eventId. L'argument eventId suffit à lui seul
        let request = {
            eventId: eventId,
            effectiveId: effectiveId,
            teamId: teamId,
            sandboxId: sandboxId,
            startDate: startDate,
            endDate: endDate
        };
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/sandbox/stats/collect/list', request, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }

    /**
     *
     * @param search
     */
    getCollectList(search: any) {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/sandbox/stats/collect/list', search, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }

    /**
     *
     * @param search
     */
    deleteCollect(eventId: number) {
        return this.http.delete<any>(ENV.hive + this.apiService.rootPath + '/sandbox/stats/collect/'+ eventId, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('MetaServices.getMeta'))
        );
    }
}