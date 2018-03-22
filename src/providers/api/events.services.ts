import {ApiService} from "./api";
import {App, ToastController} from "ionic-angular";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class EventsServices extends ApiService {
    private rootPath: string = '/api/1/commons/users';
    private rootPath2: string = '/api/2/commons';

    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {HttpClient} http
     * @param {TranslateService} translate
     */
    constructor(app: App,
                authenticationService: AuthenticationService,
                toastCtrl: ToastController,
                private http: HttpClient,
                private translate: TranslateService) {
        super(app, authenticationService, toastCtrl);
    }
}