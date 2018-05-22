import { MessageBus } from './../message-bus.service';
import {Injectable} from "@angular/core";
import {App, ToastController} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import {of} from "rxjs/observable/of";
import {HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";
/**
 * ApiService
 */
@Injectable()
export class ApiService {
    private excludedOperations: string[] = ['UserService.login'];
    rootPath: string = '/api/1/';
    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     */
    constructor(
        private app: App, 
        private authenticationService: AuthenticationService, 
        private toastCtrl: ToastController,
        private eventService: MessageBus
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
            console.error(operation, error);
            if (error.status === 401 && this.excludedOperations.indexOf(operation) === -1) {
                console.debug('[APIService] - handleError',this.app.getRootNav(),  operation, result);
               this.eventService.broadcast(MessageBus.goToLogin, {});
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
