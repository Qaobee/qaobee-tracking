/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.  Qaobee
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
import {ApiService} from "./api";
import {App, ToastController} from "ionic-angular";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ENV} from "@app/env";
import {catchError} from "rxjs/operators";

@Injectable()
export class PersonService extends ApiService {
    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {HttpClient} http
     */

    private apiUrl: string;

    constructor(app: App,
                authenticationService: AuthenticationService,
                toastCtrl: ToastController,
                private http: HttpClient) {
        super(app, authenticationService, toastCtrl);
        this.apiUrl = ENV.hive + this.rootPath + '/sandbox/effective/person/';
    }

    getListPersonSandbox(sandboxId:string) {
        
        return this.http.get<any>(this.apiUrl+'listSandbox/?sandboxId=' + sandboxId, this.addHeaderToken()).pipe(
            catchError(this.handleError('PersonService.getListPersonSandbox'))
        );
    }

    /**
     *
     * @function addPerson()
     * @description add a person 
     * @param {Person} person : person to add
     */
    addPerson(person: any) {
        return this.http.put<any>(this.apiUrl+'/add', person, this.addHeaderToken()).pipe(
            catchError(this.handleError('addPerson', person))
        );
    }

    /**
     *
     * @function updatePerson()
     * @description add a person 
     * @param {Person} person : person to update
     */
    updatePerson(person: any) {
        return this.http.put<any>(this.apiUrl+'/update', person, this.addHeaderToken()).pipe(
            catchError(this.handleError('updatePerson', person))
        );
    }
}