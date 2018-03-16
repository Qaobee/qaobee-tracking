import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { ApiService } from "./api";


import { ToastController } from 'ionic-angular';


@Injectable()
export class UserService extends ApiService {
    private rootPath: string = '/api/1/commons/users/user'
    /**
     *
     * @param {Http} http
     * @param {ToastController} toastCtrl
     */
    constructor(private http: HttpClient, toastCtrl: ToastController) {
        super(toastCtrl);
    }

    /**
     * Login request
     * 
     * @param login 
     * @param passwd 
     */
    login(login: string, passwd: string): Observable<Array<any>> {
        console.log('login');
        return this.http.post<any>(this.host + this.rootPath + '/login', { login: login, password: passwd }).pipe(
            catchError(this.handleError('getListOfFeatured'))
        );
    }
}