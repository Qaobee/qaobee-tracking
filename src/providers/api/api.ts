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

import { Injectable } from "@angular/core";
import { ToastController } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { of } from "rxjs/observable/of";
import { AuthenticationService } from "../authentication.service";
import { MessageBus } from '../message-bus.service';
import { ENV } from "@app/env";
import { Storage } from "@ionic/storage";

/**
 * ApiService
 */
@Injectable()
export class ApiService {
    rootPath: string = '/api/1';

    /**
     *
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {MessageBus} eventService
     * @param {HttpClient} http
     * @param {Storage} storage
     */
    constructor(
        private authenticationService: AuthenticationService,
        private toastCtrl: ToastController,
        private eventService: MessageBus,
        private http: HttpClient,
        private storage: Storage
    ) {
    }

    /**
     *
     * @param {string} operation
     * @param {T} result
     * @returns {(error: any) => Observable<T>}
     */
    handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            console.error(`${operation} failed: ${error.message}`);
            let errMsg = (error.error.message) ? error.error.message : error.status ? error.statusText : 'Server error';
            this.toastCtrl.create({
                message: errMsg,
                duration: 3000,
                position: 'top',
                cssClass: 'danger-toast'
            }).present();
            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }

    /**
     *
     * @returns {}
     */
    addHeaderToken(): any {
        return {headers: new HttpHeaders().set('token', this.authenticationService.token)};
    }

    /**
     * Sso login
     *
     * @returns {Observable<any>}
     */
    doSSO(): Observable<any> {
        return new Observable<any>((observer) => {
            this.storage.get('login').then(l => {
                this.storage.get('mobileToken').then(mt => {
                    if (l && mt) {
                        this.http.post<any>(ENV.hive + this.rootPath + '/commons/users/user/sso', {
                            login: l,
                            mobileToken: mt
                        }).subscribe(result => {
                            if (result) {
                                this.storage.set('mobileToken', mt);
                                this.authenticationService.isLogged = true;
                                this.authenticationService.token = result.account.token;
                            }
                            observer.next(result);
                            observer.complete();
                        });
                    }
                });
            });
        });
    }
}
