
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
import {EventStatsPage} from "./event-stats/event-stats";
import {PipesModule} from "../../pipes/pipes.module";
import { StatsEventService } from './stats.event.service';

@NgModule({
    declarations: [
        EventListPage,
        EventDetailPage,
        EventStatsPage,
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
    providers: [
        StatsEventService
    ],
    entryComponents: [
        EventListPage,
        EventDetailPage,
        EventStatsPage,
        EventUpsertPage
    ]
})

export class EventsModule {
}
