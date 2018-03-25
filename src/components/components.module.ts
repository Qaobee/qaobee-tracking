import {NgModule} from '@angular/core';
import {MenuHeaderComponent} from './menu-header/menu-header';
import {IonicModule} from "ionic-angular";
import {MyApp} from "../app/app.component";
import {NextEventComponent} from './next-event/next-event';
import {LastCollectComponent} from './last-collect/last-collect';
import {Utils} from "../providers/utils";
import {APIModule} from "../providers/api/api.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
    declarations: [MenuHeaderComponent,
    NextEventComponent,
    LastCollectComponent],
    imports: [
        IonicModule.forRoot(MyApp),
        APIModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    exports: [
        MenuHeaderComponent,
        NextEventComponent,
        LastCollectComponent
    ],
    providers: [
        Utils
    ]
})
export class ComponentsModule {
}
