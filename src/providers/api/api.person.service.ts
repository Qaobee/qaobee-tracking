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

import { ApiService } from "./api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "@app/env";
import { catchError } from "rxjs/operators";

@Injectable()
export class PersonService {
    private apiUrl: string;

    /**
     *
     * @param {ApiService} apiService
     * @param {HttpClient} http
     */
    constructor(
        private apiService: ApiService,
        private http: HttpClient) {
        this.apiUrl = ENV.hive + this.apiService.rootPath + '/sandbox/effective/person/';
    }

    /**
     * @function getListPersonSandbox()
     * @description Get list person by sandbox Id
     * @param sandboxId
     */
    getListPersonSandbox(sandboxId: string) {
        return this.http.get<any>(this.apiUrl + 'listSandbox/?sandboxId=' + sandboxId).pipe(
            catchError(this.apiService.handleError('PersonService.getListPersonSandbox'))
        );
    }

    /**
     * @function getListPerson()
     * @description Get list person by list of person's id and with list field to retrieve
     * @param listId
     * @param listField
     */
    getListPerson(listId: any, listField: any) {
        return this.http.post<any>(this.apiUrl + '/list', {
            listId: listId,
            listField: listField
        }).pipe(
            catchError(this.apiService.handleError('PersonService.getListPerson'))
        );
    }

    /**
     *
     * @function addPerson()
     * @description add a person
     * @param {any} person : person to add
     */
    addPerson(person: any) {
        return this.http.put<any>(this.apiUrl + '/add', person).pipe(
            catchError(this.apiService.handleError('addPerson', person))
        );
    }

    /**
     *
     * @function updatePerson()
     * @description add a person
     * @param {any} person : person to update
     */
    updatePerson(person: any) {
        return this.http.put<any>(this.apiUrl + '/update', person).pipe(
            catchError(this.apiService.handleError('updatePerson', person))
        );
    }
}