import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {ComponentsModule} from "../../components/components.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {App, IonicModule} from "ionic-angular";
import {TeamBuildPage} from "./team-build/team-build";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
    declarations: [
        TeamBuildPage
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
        }),
        PipesModule
    ],
    entryComponents: [
        TeamBuildPage,
    ]
})

export class CollectModule {
}
