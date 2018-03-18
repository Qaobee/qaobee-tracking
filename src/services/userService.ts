import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import {ApiService} from "./api";
import {App, Platform, ToastController} from 'ionic-angular';
import {AuthenticationService} from "./authenticationService";


@Injectable()
export class UserService extends ApiService {
    private rootPath: string = '/api/1/commons/users/user';

    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {HttpClient} http
     * @param {Platform} plt
     */
    constructor(app:App,
                authenticationService: AuthenticationService,
                toastCtrl: ToastController,
                private http: HttpClient,
                private plt: Platform) {
        super(app, authenticationService, toastCtrl);
    }

    /**
     * Login request
     *
     * @param login
     * @param passwd
     * @param mobileToken
     */
    login(login: string, passwd: string, mobileToken: string): Observable<Array<any>> {
        return this.http.post<any>(this.host + this.rootPath + '/login', {
            login: login,
            password: passwd,
            mobileToken: mobileToken,
            os: this.plt.platforms()[1]
        }).pipe(
            catchError(this.handleError('UserService.login'))
        );
    }

    /**
     * Sso login
     *
     * @param {string} login
     * @param {string} mobileToken
     * @returns {Observable<Array<any>>}
     */
    sso(login: string, mobileToken: string): Observable<Array<any>> {
        return this.http.post<any>(this.host + this.rootPath + '/sso', {
            login: login,
            mobileToken: mobileToken
        }).pipe(
            catchError(this.handleError('UserService.login'))
        );
    }
}