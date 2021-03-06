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

import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, LOCALE_ID, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UniqueDeviceID } from "@ionic-native/unique-device-id";

import { MessageBus } from "../providers/message-bus.service";
import { AuthenticationService } from "../providers/authentication.service";

import { ComponentsModule } from "../components/components.module";
import { PageModule } from "../pages/pages.module";
import { APIModule } from "../providers/api/api.module";
import { Utils } from "../providers/utils";
import { SettingsService } from "../providers/settings.service";
import { LocationService } from "../providers/location.service";
import { AppVersion } from "@ionic-native/app-version";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { Device } from "@ionic-native/device";
import { APIInterceptor } from "../providers/api/interceptor";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        APIModule,
        ComponentsModule,
        PasswordStrengthBarModule,
        PageModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [ HttpClient ]
            }
        })
    ],
    bootstrap: [ IonicApp ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [
        MyApp
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AppVersion,
        GoogleAnalytics,
        StatusBar,
        SplashScreen,
        UniqueDeviceID,
        AuthenticationService,
        MessageBus,
        SettingsService,
        LocationService,
        Utils,
        Device,
        {
            provide: LOCALE_ID,
            deps: [ SettingsService ],      //some service handling global settings
            useFactory: (settingsService) => settingsService.getLanguage()  //returns locale string
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: APIInterceptor,
            multi: true,
        },
        File,
        Camera
    ]
})
export class AppModule {
}
