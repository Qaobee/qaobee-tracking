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
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import {App, NavController, ToastController} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {of} from "rxjs/observable/of";
import {HttpHeaders} from "@angular/common/http";
import {LoginPage} from "../../pages/login/login";
import {AuthenticationService} from "../authentication.service";

/**
 * ApiService
 */
@Injectable()
export class ApiService {
    private excludedOperations: string[] = ['UserService.login'];
    protected rootPath: string = '/api/1/';
    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     */
    constructor(public app: App, public authenticationService: AuthenticationService, public toastCtrl: ToastController) {
    }

    /**
     *
     * @param {string} operation
     * @param {T} result
     * @returns {(error: any) => Observable<T>}
     */
    handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation, error);
            if (error.status === 401 && this.excludedOperations.indexOf(operation) === -1) {
                console.debug('[APIService] - handleError',this.app.getRootNav(),  operation, result);
                this.app.getRootNav().push(LoginPage, {});
                this.authenticationService.isLogged = false;
                return of(result);
            } else {
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
            }
        };
    }

    /**
     *
     * @returns {}
     */
    addHeaderToken(): any {
        return {headers: new HttpHeaders().set('token', this.authenticationService.token)};
    }
}
