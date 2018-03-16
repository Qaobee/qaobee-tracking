import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { SignupPage } from '../pages/signup/signup';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  /**
   * 
   * @param platform 
   * @param statusBar 
   * @param splashScreen 
   * @param translate 
   */
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, translate: TranslateService) {
    this.initializeApp();
    this.pages = [];
    translate.setDefaultLang('en');
    translate.use(translate.getBrowserLang());
    translate.get(['Home', 'Login', 'Subscribe']).subscribe(
      value => {
        this.pages = [
          { title: value['Home'], component: WelcomePage },
          { title: value['Login'], component: LoginPage },
          { title: value['Subscribe'], component: SignupPage }
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
