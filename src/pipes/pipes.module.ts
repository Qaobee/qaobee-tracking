import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";
import { MyApp } from "../app/app.component";
import { APIModule } from "../providers/api/api.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../app/app.module";
import { HttpClient } from "@angular/common/http";
import { KeysPipe } from "./keys.pipe";

@NgModule({
    declarations: [
        KeysPipe
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        APIModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [ HttpClient ]
            }
        })
    ],
    exports: [
        KeysPipe
    ],
    providers: []
})
export class PipesModule {
}
