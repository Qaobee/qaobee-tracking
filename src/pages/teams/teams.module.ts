/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.  Qaobee
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
import { TeamAdversaryPage } from './team-adversary/team-adversary';
import { TeamListPage } from './team-list/team-list';
import { TeamDetailPage } from './team-detail/team-detail';
import { TeamUpsertPage } from './team-upsert/team-upsert';
import { TeamStatsPage } from './team-stats/team-stats';

import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { ComponentsModule } from "../../components/components.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../app/app.module";
import { App, IonicModule } from "ionic-angular";


@NgModule({
    declarations: [
        TeamAdversaryPage,
        TeamListPage,
        TeamDetailPage,
        TeamUpsertPage,
        TeamStatsPage
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
        })
    ],
    entryComponents: [
        TeamAdversaryPage,
        TeamListPage,
        TeamDetailPage,
        TeamUpsertPage,
        TeamStatsPage
    ]
})

export class TeamsModule {
}
