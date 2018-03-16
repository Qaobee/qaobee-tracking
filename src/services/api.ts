import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {of} from "rxjs/observable/of";
/**
 * ApiService
 */
@Injectable()
export class ApiService {
    protected toastCtrl: ToastController;
    protected host:string = "http://localhost:8888"
    /**
     *
     * @param toasterService
     * @param authenticationService
     * @param router
     */
    constructor(toastCtrl: ToastController) {
        this.toastCtrl = toastCtrl;
    }

    /**
     *
     * @param error
     * @returns {string}
     */
    handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
