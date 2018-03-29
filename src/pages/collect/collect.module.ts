import {NgModule} from '@angular/core';
import {KeysPipe} from "../../pipes/keys.pipe";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {ComponentsModule} from "../../components/components.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {App, IonicModule} from "ionic-angular";
import {TeamBuildPage} from "./team-build/team-build";

@NgModule({
    declarations: [
        TeamBuildPage,
        KeysPipe
    ],
    imports: [
        HttpClientModule,
        IonicModule.forRoot(App),
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
        TeamBuildPage,
    ]
})

export class CollectModule {
}
