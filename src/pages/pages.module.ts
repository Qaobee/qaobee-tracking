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

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile/profile';
import { WelcomePage } from "./welcome/welcome";
import { HomePage } from "./home/home";
import { SynchroPage } from './synchro/synchro';
import { LogoutPage } from './logout/logout';
import { LoginPage } from "./login/login";
import { SignupPage } from "./signup/signup";
import { SignupEndPage } from './signup/signupEnd';
import { SettingsPage } from './settings/settings';
import { ComponentsModule } from "../components/components.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { createTranslateLoader } from "../app/app.module";
import { EventsModule } from "./events/events.module";
import { PlayersModule } from "./players/players.module";
import { TeamsModule } from "./teams/teams.module";
import { CollectModule } from "./collect/collect.module";
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { FeedbackComponent } from './feedback/feedback';

@NgModule({
    declarations: [
        HomePage,
        LoginPage,
        ProfilePage,
        SettingsPage,
        SignupPage,
        SignupEndPage,
        LogoutPage,
        SynchroPage,
        WelcomePage,
        FeedbackComponent
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        HttpClientModule,
        IonicStorageModule.forRoot(),
        ComponentsModule,
        PasswordStrengthBarModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [ HttpClient ]
            }
        }),
        EventsModule,
        PlayersModule,
        TeamsModule,
        CollectModule
    ],
    entryComponents: [
        HomePage,
        LogoutPage,
        ProfilePage,
        SettingsPage,
        SignupPage,
        SignupEndPage,
        LoginPage,
        SynchroPage,
        WelcomePage,
        FeedbackComponent
    ]
})

export class PageModule {
}
