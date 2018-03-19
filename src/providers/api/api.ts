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
    private navCtrl: NavController;
    private excludedOperations: string[] = ['UserService.login'];

    /**
     *
     * @param {App} app
     * @param {AuthenticationService} authenticationService
     * @param {ToastController} toastCtrl
     */
    constructor(app: App, public authenticationService: AuthenticationService, public toastCtrl: ToastController) {
        this.navCtrl = app.getActiveNav();
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
                this.navCtrl.push(LoginPage);
                this.authenticationService.isLogged = false;
                return of(result as T);
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
                return of(result as T);
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
