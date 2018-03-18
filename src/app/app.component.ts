import {Component, ViewChild} from '@angular/core';
import {Nav, NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {LoginPage} from '../pages/login/login';
import {WelcomePage} from '../pages/welcome/welcome';
import {SignupPage} from '../pages/signup/signup';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from "../services/authenticationService";
import {Storage} from "@ionic/storage";
import {UserService} from "../services/userService";
import {MenuPage} from "../pages/menu/menu";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;

    pages: Array<{ title: string, component: any }>;

    /**
     *
     * @param {Platform} platform
     * @param {StatusBar} statusBar
     * @param {SplashScreen} splashScreen
     * @param {UserService} userService
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {TranslateService} translate
     */
    constructor(private platform: Platform,
                private statusBar: StatusBar,
                private splashScreen: SplashScreen,
                private userService: UserService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                translate: TranslateService) {
        this.initializeApp();
        this.pages = [];
        translate.setDefaultLang('en');
        translate.use(translate.getBrowserLang());
        translate.get(['Home', 'Login', 'Subscribe']).subscribe(
            value => {
                this.pages = [
                    {title: value['Home'], component: WelcomePage},
                    {title: value['Login'], component: LoginPage},
                    {title: value['Subscribe'], component: SignupPage}
                ];
            }
        )
    }

    /** */
    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.storage.get("login").then(l => {
                this.storage.get("mobileToken").then(mt => {
                    if(l && mt) {
                        this.userService.sso(l, mt).subscribe((result:any) => {
                            if (result) {
                                this.authenticationService.isLogged = true;
                                this.authenticationService.token = result.account.token;
                                this.authenticationService.user = result;
                                this.storage.set("login", l);
                                this.storage.set("mobileToken", mt);
                                console.log(result);
                                this.nav.push(MenuPage, {user: result});
                            }
                        });
                    }
                });
            });
        });
    }

    /**
     *
     * @param page
     */
    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
