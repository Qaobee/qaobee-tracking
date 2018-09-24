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
import { EventListPage } from "./event-list/event-list";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { ComponentsModule } from "../../components/components.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../app/app.module";
import { App, IonicModule } from "ionic-angular";
import { EventDetailPage } from "./event-detail/event-detail";
import { EventUpsertPage } from "./event-upsert/event-upsert";
import { EventStatsPage } from "./event-stats/event-stats";
import { PipesModule } from "../../pipes/pipes.module";
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
                deps: [ HttpClient ]
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
