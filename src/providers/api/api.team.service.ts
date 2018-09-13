import { ApiService } from "./api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "@app/env";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Injectable()
export class TeamService {
    /**
     *
     * @param {ApiService} apiService
     * @param {HttpClient} http
     */
    constructor(
        private apiService: ApiService,
        private http: HttpClient) {
    }

    /**
     *
     * @param {string} effectiveId
     * @param {string} sandboxId
     * @param {string} enable
     * @param {string} adversary
     * @returns {Observable<any>}
     */
    getTeams(effectiveId: string, sandboxId: string, enable: string, adversary: string): Observable<any> {
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/team/list?enable=' + enable + '&adversary=' + adversary + '&effectiveId=' + effectiveId + '&sandboxId=' + sandboxId, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('TeamService.getTeams'))
        );
    }

    /**
     * add team
     * @param team
     * @returns {Observable<any>}
     */
    addTeam(team: any): Observable<any> {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/team/add', team, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('TeamService.addTeam'))
        );
    }

    /**
     * update team
     * @param team
     * @returns {Observable<any>}
     */
    updateTeam(team: any): Observable<any> {
        return this.http.put<any>(ENV.hive + this.apiService.rootPath + '/sandbox/effective/team/update', team, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('TeamService.updateTeam'))
        );
    }
}