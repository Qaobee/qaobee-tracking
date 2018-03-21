import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProfilePage} from './profile/profile';
import {WelcomePage} from "./welcome/welcome";
import {HomePage} from "./home/home";
import {LoginPage} from "./login/login";
import {SignupPage} from "./signup/signup";
import {ComponentsModule} from "../components/components.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {createTranslateLoader} from "../app/app.module";

@NgModule({
    declarations: [
        HomePage,
        WelcomePage,
        LoginPage,
        SignupPage,
        ProfilePage,
    ],
    imports: [
        IonicPageModule.forChild(ProfilePage),
        HttpClientModule,
        IonicStorageModule.forRoot(),
        ComponentsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    entryComponents: [
        HomePage,
        WelcomePage,
        LoginPage,
        SignupPage
    ]
})
export class PageModule {
}
