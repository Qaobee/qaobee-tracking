import {ApiService} from "./api";
import {App, ToastController} from "ionic-angular";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
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
     * @param {TranslateService} translate
     */
    constructor(app: App,
                authenticationService: AuthenticationService,
                toastCtrl: ToastController,
                private http: HttpClient,
                private translate: TranslateService) {
        super(app, authenticationService, toastCtrl);
    }

    getListPersonSandbox(sandboxId:string) {
        
        return this.http.get<any>(ENV.hive + this.rootPath + '/sandbox/effective/person/listSandbox/?sandboxId=' + sandboxId, this.addHeaderToken()).pipe(
            catchError(this.handleError('PersonService.getListPersonSandbox'))
        );
    }
}