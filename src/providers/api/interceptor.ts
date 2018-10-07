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

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { ApiService } from "./api";
import { MessageBus } from "../message-bus.service";
import { AuthenticationService } from "../authentication.service";
import { ENV } from "@app/env";

/**
 * HTTP Interceptor
 */
@Injectable()
export class APIInterceptor implements HttpInterceptor {


    private excludedOperations: string[] = [ 'user/sso', 'user/login' ];

    /**
     *
     * @param {ApiService} apiService
     * @param {MessageBus} eventService
     * @param {AuthenticationService} authenticationService
     */
    constructor(private apiService: ApiService,
                private eventService: MessageBus,
                private authenticationService: AuthenticationService) {
    }

    /**
     *
     * @param {HttpRequest} req
     * @return {HttpRequest<any>}
     */
    private applyCredentials(req: HttpRequest<any>): HttpRequest<any> {
        if (req.url.startsWith(ENV.hive) && this.authenticationService.token) {
            return req.clone<HttpRequest<any>>({
                headers: new HttpHeaders().set('token', this.authenticationService.token)
            });
        }
        return req;
    };

    /**
     *
     * @param {HttpRequest} req
     * @param {HttpHandler} next
     * @return {Observable<HttpEvent<any>>}
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(this.applyCredentials(req)).do(
            () => { }).catch((err: any, caught: Observable<HttpEvent<any>>) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 && !req.url.endsWith(this.excludedOperations[ 0 ]) && !req.url.endsWith(this.excludedOperations[ 1 ])) {
                    return this.apiService.doSSO().mergeMap(() => {
                        return next.handle(this.applyCredentials(req.clone()));
                    });
                }
                if (err.status === 401) {
                    this.eventService.broadcast(MessageBus.goToLogin, {});
                    this.authenticationService.isLogged = false;
                    return Observable.throw(err);
                } else {
                    return Observable.throw(err);
                }
            } else {
                return Observable.throw(err);
            }
        });
    }
}