import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {IonicStorageModule} from '@ionic/storage';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {WelcomePage} from '../pages/welcome/welcome';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {UserService} from '../services/userService';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MenuPage} from "../pages/menu/menu";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {AuthenticationService} from "../services/authenticationService";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        WelcomePage,
        LoginPage,
        SignupPage,
        MenuPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        WelcomePage,
        LoginPage,
        SignupPage,
        MenuPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        UserService,
        UniqueDeviceID,
        AuthenticationService,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
