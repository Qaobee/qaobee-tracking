import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import {ApiService} from "./api";
import {App, Platform, ToastController} from 'ionic-angular';
import {AuthenticationService} from "../authentication.service";
import {TranslateService} from "@ngx-translate/core";
import {FileTransfer, FileUploadOptions} from "@ionic-native/file-transfer";
import {ENV} from "@app/env";


@Injectable()
export class UserService extends ApiService {
    private rootPath2: string = '/api/2';

    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {HttpClient} http
     * @param {TranslateService} translate
     * @param {Platform} plt
     */
    constructor(app: App,
                authenticationService: AuthenticationService,
                toastCtrl: ToastController,
                private http: HttpClient,
                private translate: TranslateService,
                private fileTransfer: FileTransfer,
                private plt: Platform) {
        super(app, authenticationService, toastCtrl);
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
        return this.http.post<any>(ENV.hive + this.rootPath + '/commons/users/user/login', {
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
     * @returns {Observable<any>}
     */
    sso(login: string, mobileToken: string): Observable<any> {
        return this.http.post<any>(ENV.hive + this.rootPath + '/commons/users/user/sso', {
            login: login,
            mobileToken: mobileToken
        }).pipe(
            catchError(this.handleError('UserService.sso'))
        );
    }

    /**
     * Register new user
     * @param user
     * @returns {Observable<any>}
     */
    registerUser(user: any): Observable<any>  {
        user.captcha = 'empty';
        user.country = this.translate.getBrowserLang();
        user.account.origin = 'mobile';
        return this.http.put<any>(ENV.hive + this.rootPath2 + '/commons/users/signup/register', user).pipe(
            catchError(this.handleError('UserService.registerUser'))
        );
    }

    /**
     *
     * @param {string} login
     * @returns {Observable<any>}
     */
    usernameTest(login: string): Observable<any>  {
        return this.http.get<any>(ENV.hive + this.rootPath2 + '/commons/multi/signup/test/' + login).pipe(
            catchError(this.handleError('UserService.usernameTest'))
        );
    }

    /**
     *
     * @param user
     * @returns {Observable<any>}
     */
    updateUser(user: any): Observable<any>  {
        return this.http.post<any>(ENV.hive + this.rootPath + '/commons/users/profile', user, this.addHeaderToken()).pipe(
            catchError(this.handleError('UserService.updateUser'))
        );
    }

    /**
     *
     * @returns {Observable<any>}
     */
    logoff(): Observable<any>  {
        return this.http.get<any>(ENV.hive + this.rootPath + '/commons/users/user/logout', this.addHeaderToken()).pipe(
            catchError(this.handleError('UserService.logoff'))
        );
    }

    /**
     *
     * @returns {Observable<any>}
     */
    getCurrentUser(): Observable<any>  {
        return this.http.get<any>(ENV.hive + this.rootPath + '/commons/users/user/current', this.addHeaderToken()).pipe(
            catchError(this.handleError('UserService.getCurrentUser'))
        );
    }

    /**
     *
     * @param {string} path
     * @returns {Observable<any>}
     */
    getEncryptedInfos(path: string): Observable<any>  {
        return this.http.post<any>(ENV.hive + this.rootPath + '/commons/users/user/encrypt', {path: path}, this.addHeaderToken()).pipe(
            catchError(this.handleError('UserService.getEncryptedInfos'))
        );
    }

    /**
     *
     * @param {string} filePath
     * @returns {Promise<FileUploadResult>}
     */
    postAvatar(filePath: string) {
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


}