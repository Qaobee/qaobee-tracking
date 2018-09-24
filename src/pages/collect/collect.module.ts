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

import { SubstitutionModal } from './substitution-modal/substitution-modal';
import { StatCollector } from '../../providers/collect/stat.collector';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { ComponentsModule } from "../../components/components.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../app/app.module";
import { App, IonicModule } from "ionic-angular";
import { TeamBuildPage } from "./team-build/team-build";
import { PipesModule } from "../../pipes/pipes.module";
import { CollectPage } from "./collect/collect";
import { HandFSM } from "../../providers/collect/hand.fsm";
import { GoalModal } from './goal-modal/goal-modal';
import { TeamBuildComponent } from '../../components/team-build/team-build';
import { StatsModal } from './stats-modal/stats-modal';
import { CollectListPage } from "./collect-list/collect-list";

@NgModule({
    declarations: [
        TeamBuildPage,
        CollectPage,
        GoalModal,
        SubstitutionModal,
        StatsModal,
        TeamBuildComponent,
        CollectListPage
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
        PipesModule,
    ],
    providers: [
        HandFSM,
        StatCollector
    ],
    entryComponents: [
        TeamBuildPage,
        CollectPage,
        GoalModal,
        SubstitutionModal,
        StatsModal,
        CollectListPage
    ]
})

export class CollectModule {
}
