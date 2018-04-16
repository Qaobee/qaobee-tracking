/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.  Qaobee
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
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { SignupPage } from '../pages/signup/signup';
import { PlayerListPage } from '../pages/players/player-list/player-list';
import { SettingsPage } from '../pages/settings/settings';

import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from "../providers/authentication.service";
import { Storage } from "@ionic/storage";
import { UserService } from "../providers/api/api.user.service";
import { MessageBus } from "../providers/message-bus.service";
import { MetaService } from "../providers/api/api.meta.service";
import { HomePage } from "../pages/home/home";
import { EventListPage } from "../pages/events/event-list/event-list";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = WelcomePage;
  pages: Array<{ title: string, component: any, icon: string }>;
  user: any;

  /**
   *
   * @param {Platform} platform
   * @param {StatusBar} statusBar
   * @param {SplashScreen} splashScreen
   * @param {UserService} userService
   * @param {Storage} storage
   * @param {AuthenticationService} authenticationService
   * @param {TranslateService} translate
   * @param {MessageBus} eventService
   * @param {MetaService} metaService
   */
  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private userService: UserService,
              private storage: Storage,
              private authenticationService: AuthenticationService,
              private translate: TranslateService,
              private eventService: MessageBus,
              private metaService: MetaService) {
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

      this.eventService.on(MessageBus.userLogged, user => {
        this.user = user;
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
      });

      this.eventService.on(MessageBus.navigation, page => {
        this.nav.push(page.component, page.options);
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

  private buildMenu() {
    this.translate.get(['menu.Home', 'menu.Login', 'menu.Subscribe']).subscribe(
      value => {
        this.pages = [
          {title: value['menu.Home'], component: WelcomePage, icon: 'home'},
          {title: value['menu.Login'], component: LoginPage, icon: 'log-in'},
          {title: value['menu.Subscribe'], component: SignupPage, icon: 'log-in'}
        ];
      }
    )
  }

  private buildLoggedMenu() {
    this.translate.get(['menu.Home', 'menu.Events', 'menu.Players', 'menu.Stats', 'menu.Settings',]).subscribe(
      value => {
        this.pages = [
          {title: value['menu.Home'], component: HomePage, icon: 'home'},
          {title: value['menu.Events'], component: EventListPage, icon: 'calendar'},
          {title: value['menu.Players'], component: PlayerListPage, icon: 'people'},
          //{ title: value['menu.Stats'], component: CollectListPage, icon: 'stats' },
          {title: value['menu.Settings'], component: SettingsPage, icon: 'settings'}
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
              this.storage.set("mobileToken", mt);
              this.eventService.broadcast(MessageBus.userLogged, result);
            }
          });
        }
      });
    });
  }
}
