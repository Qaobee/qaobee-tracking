import { Observable } from 'rxjs/Observable';
import {ApiService} from "./api";
import {App, ToastController} from "ionic-angular";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ENV} from "@app/env";
import {catchError} from "rxjs/operators";

@Injectable()
export class MetaService extends ApiService {
    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {HttpClient} http
     */
    constructor(app: App,
                authenticationService: AuthenticationService,
                toastCtrl: ToastController,
                private http: HttpClient) {
        super(app, authenticationService, toastCtrl);
    }

    /**
     *
     * @returns {Observable<any>}
     */
    getMeta():Observable<any> {
        return this.http.get<any>(ENV.hive + this.rootPath +  '/commons/users/user/meta', this.addHeaderToken()).pipe(
            catchError(this.handleError('MetaServices.getMeta'))
        );
    }

    /**
     *
     * @returns {Observable<any>}
     */
    getParams():Observable<any> {
        return this.http.get<any>(ENV.hive + this.rootPath + '/commons/settings/get', this.addHeaderToken()).pipe(
            catchError(this.handleError('MetaServices.getParams'))
        );
    }

}