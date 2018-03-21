import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {IonicStorageModule} from '@ionic/storage';
import {FileTransfer} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {Camera} from '@ionic-native/camera'; 

import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {UniqueDeviceID} from "@ionic-native/unique-device-id";

import {EventsService} from "../providers/event.service";
import {UserService} from "../providers/api/user.service";
import {AuthenticationService} from "../providers/authentication.service";

import {ComponentsModule} from "../components/components.module";
import {PageModule} from "../pages/pages.module";

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
        UserService,
        UniqueDeviceID,
        AuthenticationService,
        EventsService,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        FileTransfer,
        File,
        Camera
    ]
})
export class AppModule {
}
