import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {LoginPage} from '../pages/login/login';
import {WelcomePage} from '../pages/welcome/welcome';
import {SignupPage} from '../pages/signup/signup';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from "../providers/authentication.service";
import {Storage} from "@ionic/storage";
import {UserService} from "../providers/api/user.service";
import {MenuPage} from "../pages/menu/menu";
import {EventsService} from "../providers/event.service";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = LoginPage;
    pages: Array<{ title: string, component: any, icon: string }>;
    private user: any;

    /**
     *
     * @param {Platform} platform
     * @param {StatusBar} statusBar
     * @param {SplashScreen} splashScreen
     * @param {UserService} userService
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {TranslateService} translate
     * @param {EventsService} eventService
     */
    constructor(private platform: Platform,
                private statusBar: StatusBar,
                private splashScreen: SplashScreen,
                private userService: UserService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private translate: TranslateService,
                private eventService: EventsService) {
        this.initializeApp();
        this.pages = [];
        translate.setDefaultLang('en');
        translate.use(translate.getBrowserLang());

    }

    /** */
    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.buildMenu();
            this.trySSO();

            this.eventService.on('user-logged', user => {
                this.user = user;
                this.buildLoggedMenu();
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

    private buildMenu() {
        this.translate.get(['Home', 'Login', 'Subscribe']).subscribe(
            value => {
                this.pages = [
                    {title: value['Home'], component: WelcomePage, icon: 'home'},
                    {title: value['Login'], component: LoginPage, icon: 'log-in'},
                    {title: value['Subscribe'], component: SignupPage, icon: 'log-in'}
                ];
            }
        )
    }

    private buildLoggedMenu() {
        this.translate.get(['Home', 'Logout']).subscribe(
            value => {
                this.pages = [
                    {title: value['Home'], component: MenuPage, icon: 'home'},
                    {title: value['Logout'], component: LoginPage, icon: 'log-out'}
                ];
            }
        )
    }

    private trySSO() {
        this.storage.get("login").then(l => {
            this.storage.get("mobileToken").then(mt => {
                if (l && mt) {
                    this.userService.sso(l, mt).subscribe((result: any) => {
                        if (result) {
                            this.authenticationService.isLogged = true;
                            this.authenticationService.token = result.account.token;
                            this.authenticationService.user = result;
                            this.storage.set("login", l);
                            this.storage.set("mobileToken", mt);
                            console.log(result);
                            this.nav.setRoot(MenuPage, {user: result});
                            this.eventService.broadcast('user-logged', result);
                        }
                    });
                }
            });
        });
    }
}
