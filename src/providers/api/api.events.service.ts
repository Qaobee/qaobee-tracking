import {ApiService} from "./api";
import {App, ToastController} from "ionic-angular";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {ENV} from "@app/env";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {HttpResponse} from "@angular/common/http/src/response";

@Injectable()
export class EventsService extends ApiService {
    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     * @param {HttpClient} http
     * @param {TranslateService} translate
     * @returns {Observable<any>}
     */
    constructor(app: App,
                authenticationService: AuthenticationService,
                toastCtrl: ToastController,
                private http: HttpClient,
                private translate: TranslateService) {
        super(app, authenticationService, toastCtrl);
    }

    getEvents(startDate:number, endDate:number, type:string, activityId:string, sandboxId:string): Observable<any> {
        let request = {
            startDate: startDate,
            endDate: endDate,
            activityId: activityId,
            ownersandboxId: sandboxId
        };
        if (type) {
            request['link.type'] = type;
        }
        return this.http.post<any>(ENV.hive + this.rootPath + '/sandbox/event/event/list', request, this.addHeaderToken()).pipe(
            catchError(this.handleError('EventsService.getEvents'))
        );
    }

    /**
     *
     * @param event
     * @returns {Observable<any>}
     */
    addEvent(event: any): Observable<any> {
        return this.http.post<any>(ENV.hive + this.rootPath + '/sandbox/event/event/add', event, this.addHeaderToken()).pipe(
            catchError(this.handleError('EventsService.addEvent'))
        );
    }

}