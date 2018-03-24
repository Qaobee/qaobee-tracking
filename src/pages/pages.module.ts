import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProfilePage} from './profile/profile';
import {WelcomePage} from "./welcome/welcome";
import {HomePage} from "./home/home";
import {LoginPage} from "./login/login";
import {SignupPage} from "./signup/signup";
import {CollectListPage} from './collect-list/collect-list';
import {PlayerListPage} from './player-list/player-list';
import {EventListPage} from './event-list/event-list';
import {SettingsPage} from './settings/settings';


import {ComponentsModule} from "../components/components.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {createTranslateLoader} from "../app/app.module";
import {EventsModule} from "./events/events.module";

@NgModule({
    declarations: [
        CollectListPage,
        HomePage,
        LoginPage,
        PlayerListPage,
        ProfilePage,
        SettingsPage,
        SignupPage,
        WelcomePage
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        HttpClientModule,
        IonicStorageModule.forRoot(),
        ComponentsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        EventsModule
    ],
    entryComponents: [
        CollectListPage,
        HomePage,
        LoginPage,
        PlayerListPage,
        ProfilePage,
        SettingsPage,
        SignupPage,
        WelcomePage
    ]
})

export class PageModule {
}
