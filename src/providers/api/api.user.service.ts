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
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { TranslateService } from "@ngx-translate/core";
import { FileTransfer, FileUploadOptions, FileUploadResult } from "@ionic-native/file-transfer";
import { ENV } from "@app/env";

import { AuthenticationService } from '../authentication.service';
import { ApiService } from "./api";

@Injectable()
export class UserService {
    private rootPath2: string = '/api/2';

    /**
     * @param {AuthenticationService} authenticationService
     * @param {HttpClient} http
     * @param {TranslateService} translate
     * @param {ApiService} apiService
     * @param {FileTransfer} fileTransfer
     * @param {Platform} plt
     */
    constructor(
        private authenticationService: AuthenticationService,
        private http: HttpClient,
        private translate: TranslateService,
        private fileTransfer: FileTransfer,
        private apiService: ApiService,
        private plt: Platform) {
    }

    /**
     * Login request
     *
     * @param login
     * @param passwd
     * @param mobileToken
     * @returns {Observable<any>}
     */
    login(login: string, passwd: string, mobileToken: string): Observable<any> {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/commons/users/user/login', {
            login: login,
            password: passwd,
            mobileToken: mobileToken,
            os: this.plt.platforms()[ 1 ]
        }).pipe(
            catchError(this.apiService.handleError('UserService.login'))
        );
    }

    /**
     * Sso login
     *
     * @param {string} login
     * @param {string} mobileToken
     * @returns {Observable<any>}
     */
    sso(login: string, mobileToken: string): Observable<any> {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/commons/users/user/sso', {
            login: login,
            mobileToken: mobileToken
        }).pipe(
            catchError(this.apiService.handleError('UserService.sso'))
        );
    }

    /**
     * Register new user
     * @param user
     * @returns {Observable<any>}
     */
    registerUser(user: any): Observable<any> {
        user.captcha = 'empty';
        user.country = this.translate.getBrowserLang();
        user.account.origin = 'mobile';
        return this.http.put<any>(ENV.hive + this.rootPath2 + '/commons/users/signup/register', user).pipe(
            catchError(this.apiService.handleError('UserService.registerUser'))
        );
    }

    /**
     *
     * @param {string} login
     * @returns {Observable<any>}
     */
    usernameTest(login: string): Observable<any> {
        return this.http.get<any>(ENV.hive + this.rootPath2 + '/commons/users/signup/test/' + login).pipe(
            catchError(this.apiService.handleError('UserService.usernameTest'))
        );
    }

    /**
     *
     * @param user
     * @returns {Observable<any>}
     */
    updateUser(user: any): Observable<any> {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/commons/users/profile', user, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('UserService.updateUser'))
        );
    }

    /**
     *
     * @returns {Observable<any>}
     */
    logoff(): Observable<any> {
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/commons/users/user/logout', this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('UserService.logoff'))
        );
    }

    /**
     *
     * @returns {Observable<any>}
     */
    getCurrentUser(): Observable<any> {
        return this.http.get<any>(ENV.hive + this.apiService.rootPath + '/commons/users/user/current', this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('UserService.getCurrentUser'))
        );
    }

    /**
     *
     * @param {string} path
     * @returns {Observable<any>}
     */
    getEncryptedInfos(path: string): Observable<any> {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/commons/users/user/encrypt', {path: path}, this.apiService.addHeaderToken()).pipe(
            catchError(this.apiService.handleError('UserService.getEncryptedInfos'))
        );
    }

    /**
     *
     * @param {string} filePath
     * @returns {Promise<FileUploadResult>}
     */
    postAvatar(filePath: string): Promise<FileUploadResult> {
        let options: FileUploadOptions = {
            fileKey: 'image',
            httpMethod: 'POST',
            params: {title: this.authenticationService.user._id},
            headers: {
                'token': this.authenticationService.token,
                'Accept-Language': this.translate.getBrowserLang()
            }
        };

        return this.fileTransfer.create().upload(filePath, ENV.hive + '/file/User/avatar/' + this.authenticationService.user._id, options);
    }

    /**
     * @param {string} login
     * @returns {Promise<FileUploadResult>}
     */
    forgotPasswd(login: string) {
        return this.http.post<any>(ENV.hive + this.apiService.rootPath + '/commons/users/user/newpasswd', {login: login}).pipe(
            catchError(this.apiService.handleError('UserService.getEncryptedInfos'))
        );
    }

}