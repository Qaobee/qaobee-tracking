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
import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {IonicStorageModule} from '@ionic/storage';
import {File} from '@ionic-native/file';
import {Camera} from '@ionic-native/camera';

import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {UniqueDeviceID} from "@ionic-native/unique-device-id";

import {EventService} from "../providers/event.service";
import {AuthenticationService} from "../providers/authentication.service";

import {ComponentsModule} from "../components/components.module";
import {PageModule} from "../pages/pages.module";
import {APIModule} from "../providers/api/api.module";
import {Utils} from "../providers/utils";
import { LOCALE_ID } from '@angular/core';
import {SettingsService} from "../providers/settings.service";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        ComponentsModule,
        PageModule,
        APIModule,
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
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        UniqueDeviceID,
        AuthenticationService,
        EventService,
        SettingsService,
        Utils,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        {
            provide: LOCALE_ID,
            deps: [SettingsService],      //some service handling global settings
            useFactory: (settingsService) => settingsService.getLanguage()  //returns locale string
        },
        File,
        Camera
    ]
})
export class AppModule {
}
