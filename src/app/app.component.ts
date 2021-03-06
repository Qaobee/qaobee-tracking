/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.
 *  Qaobee
 *  All Rights Reserved.
 *
 *  NOTICE: All information contained here is, and remains
 *  the property of Qaobee and its suppliers,
 *  if any. The intellectual and technical concepts contained
 *  here are proprietary to Qaobee and its suppliers and may
 *  be covered by U.S. and Foreign Patents, patents in process,
 *  and are protected by trade secret or copyright law.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from Qaobee.
 */

import { Component, ViewChild } from '@angular/core';
import { AlertController, App, Menu, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';

import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { LogoutPage } from '../pages/logout/logout';
import { SignupPage } from '../pages/signup/signup';
import { PlayerListPage } from '../pages/players/player-list/player-list';
import { TeamListPage } from '../pages/teams/team-list/team-list';
import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from "../pages/home/home";
import { EventListPage } from "../pages/events/event-list/event-list";
import { SynchroPage } from '../pages/synchro/synchro';

import { MetaService } from "../providers/api/api.meta.service";
import { UserService } from "../providers/api/api.user.service";

import { AuthenticationService } from "../providers/authentication.service";
import { Storage } from "@ionic/storage";
import { MessageBus } from "../providers/message-bus.service";
import { AppVersion } from '@ionic-native/app-version';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ENV } from "@app/env";
import * as html2canvas from "html2canvas"
import { FeedbackComponent } from "../pages/feedback/feedback";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    @ViewChild(Menu) menu: Menu;
    rootPage: any = WelcomePage;
    pages: Array<{ title: string, component: any, icon: string, color: string }>;
    user: any;
    unregisterBackButtonAction: any;
    /**
     *
     * @param {Platform} platform
     * @param {App} app
     * @param {StatusBar} statusBar
     * @param {SplashScreen} splashScreen
     * @param {UserService} userService
     * @param {Storage} storage
     * @param {AuthenticationService} authenticationService
     * @param {TranslateService} translate
     * @param {MessageBus} eventService
     * @param {MetaService} metaService
     * @param {AlertController} alertCtrl
     * @param {AppVersion} appVersion
     * @param {GoogleAnalytics} ga
     */
    constructor(private platform: Platform,
                private app: App,
                private statusBar: StatusBar,
                private splashScreen: SplashScreen,
                private userService: UserService,
                private storage: Storage,
                private authenticationService: AuthenticationService,
                private translate: TranslateService,
                private eventService: MessageBus,
                private metaService: MetaService,
                private alertCtrl: AlertController,
                private appVersion: AppVersion,
                private ga: GoogleAnalytics
    ) {
        this.initializeApp();
        this.pages = [];
        translate.setDefaultLang('en');
        translate.use(translate.getBrowserLang());
    }

    ionViewWillLeave() {
        // Unregister the custom back button action for this page
        this.unregisterBackButtonAction && this.unregisterBackButtonAction();
    }
    /**
     *
     */
    initializeApp() {
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                this.unregisterBackButtonAction = this.platform.registerBackButtonAction(()=>{
                    let nav = this.app.getActiveNavs()[0];
                    if (nav.canGoBack()){ //Can we go back?
                        nav.pop();
                    } else {
                        this.translate.get(['app', 'actionButton']).subscribe(t =>{
                        const alert = this.alertCtrl.create({
                            title: t['app'].title,
                            message: t['app'].message,
                            buttons: [{
                                text: t['actionButton']['Cancel'],
                                role: 'cancel',
                                handler: () => {}
                            },{
                                text: t['actionButton']['Ok'],
                                handler: () => {
                                    this.platform.exitApp(); // Close this application
                                }
                            }]
                        });
                        alert.present();
                        });
                    }
                }, 101);
            });
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.buildMenu();
            this.trySSO();
            this.ga.enableUncaughtExceptionReporting(true);
                this.ga.startTrackerWithId('UA-72906581-2', 30).then(() => {
                this.appVersion.getVersionNumber().then(v => {
                    this.ga.setAppVersion(v);
                }).catch((error: any) => {
                    console.error('[MyApp] - initializeApp - error', error);
                    this.ga.setAppVersion(ENV.mode);
                    this.ga.trackView('MainApp', '',true);
                });
            }).catch(e => console.log('[MyApp] - initializeApp -Error starting GoogleAnalytics', e));

            this.eventService.on(MessageBus.userLogged, user => {
                this.user = user;
                this.ga.setUserId(user.account.login);
                this.authenticationService.isLogged = true;
                this.authenticationService.token = user.account.token;
                this.authenticationService.user = user;
                this.storage.set("login", user.account.login);
                this.buildLoggedMenu();
                this.metaService.getMeta().subscribe(m => {
                    if (m) {
                        this.authenticationService.meta = m;
                        this.nav.setRoot(HomePage, {user: user});
                    }
                });

                //Initialization search stats period
                let startDate = new Date(0).getMilliseconds();
                let endDate = Date.now();
                this.authenticationService.statStartDate = startDate;
                this.authenticationService.statEndDate = endDate;
            });

            this.eventService.on(MessageBus.userLoggout, () => {
                this.user = undefined;
                this.buildMenu();
            });

            this.eventService.on(MessageBus.navigation, page => {
                this.nav.push(page.component, page.options);
            });
            this.eventService.on(MessageBus.goToLogin, () => {
                this.nav.setRoot(LoginPage);
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
        if (page.component === HomePage) {
            this.nav.setRoot(page.component);
        } else {
            this.nav.push(page.component);
        }
    }

    feedback() {
        if(this.menu.isOpen) {
          window.setTimeout(()=>{this.feedback()}, 100);
        } else {
            html2canvas(this.nav.getNativeElement()).then((canvas) => {
                this.nav.push(FeedbackComponent, {img: canvas.toDataURL(), url: this.nav.getActive().name});
            });
        }
    }

    private buildMenu() {
        this.translate.get([ 'menu.Home', 'menu.Login', 'menu.Subscribe' ]).subscribe(
            value => {
                this.pages = [
                    {title: value[ 'menu.Home' ], component: WelcomePage, icon: 'home', color: 'primary'},
                    {
                        title: value[ 'menu.Login' ],
                        component: LoginPage,
                        icon: 'arrow-dropright-circle',
                        color: 'secondary'
                    },
                    {title: value[ 'menu.Subscribe' ], component: SignupPage, icon: 'add-circle', color: 'danger'}
                ];
            }
        )
    }

    private buildLoggedMenu() {
        this.translate.get([ 'menu.Home', 'menu.Events', 'menu.Players', 'menu.Teams', 'menu.Stats', 'menu.Settings', 'menu.Logout', 'menu.Synchro' ]).subscribe(
            value => {
                this.pages = [
                    {title: value[ 'menu.Home' ], component: HomePage, icon: 'home', color: 'primary'},
                    {title: value[ 'menu.Events' ], component: EventListPage, icon: 'calendar', color: 'danger'},
                    {title: value[ 'menu.Players' ], component: PlayerListPage, icon: 'contact', color: 'green'},
                    {title: value[ 'menu.Teams' ], component: TeamListPage, icon: 'contacts', color: 'warning'},
                    //{ title: value['menu.Stats'], component: CollectListPage, icon: 'stats',color:'danger' },
                    {title: value[ 'menu.Synchro' ], component: SynchroPage, icon: 'sync', color: 'primary'},
                    {title: value[ 'menu.Settings' ], component: SettingsPage, icon: 'settings', color: 'primary'},
                    {title: value[ 'menu.Logout' ], component: LogoutPage, icon: 'log-out', color: 'dark'}
                ];
            }
        )
    }

    private trySSO() {
        this.storage.get('login').then(l => {
            this.storage.get('mobileToken').then(mt => {
                if (l && mt) {
                    this.userService.sso(l, mt).subscribe((result: any) => {
                        if (result) {
                            this.storage.set('mobileToken', mt);
                            this.eventService.broadcast(MessageBus.userLogged, result);
                        }
                    });
                }
            });
        });
    }
}
