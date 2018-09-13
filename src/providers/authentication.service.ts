import { Injectable } from "@angular/core";

/**
 *
 */
@Injectable()
export class AuthenticationService {
    public token: string;
    public isLogged: boolean = false;
    public user: any;
    public meta: any;
    public statStartDate: number;
    public statEndDate: number;
}