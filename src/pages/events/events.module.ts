import {NgModule} from '@angular/core';
import {EventListPage} from "./event-list/event-list";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {ComponentsModule} from "../../components/components.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {App, IonicModule} from "ionic-angular";
import {EventDetailPage} from "./event-detail/event-detail";
import {EventUpsertPage} from "./event-upsert/event-upsert";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
    declarations: [
        EventListPage,
        EventDetailPage,
        EventUpsertPage
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
        EventListPage,
        EventDetailPage,
        EventUpsertPage
    ]
})

export class EventsModule {
}
