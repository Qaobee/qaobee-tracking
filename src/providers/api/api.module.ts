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

import { ErrorHandler, NgModule } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../app/app.module";
import { IonicErrorHandler } from "ionic-angular";
import { FileTransfer } from "@ionic-native/file-transfer";

import { MetaService } from "./api.meta.service";
import { EventsService } from "./api.events.service";
import { PersonService } from "./api.person.service";
import { TeamService } from "./api.team.service";
import { ActivityCfgService } from "./api.activityCfg.service";
import { CollectService } from "./api.collect.service"
import { EffectiveService } from "./api.effective.service"
import { APIStatsService } from './api.stats';
import { UserService } from "./api.user.service";
import { ApiService } from "./api";
import { CommonService } from "./api.common.service";

@NgModule({
    declarations: [],
    imports: [
        HttpClientModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [ HttpClient ]
            }
        })
    ],
    entryComponents: [],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ApiService,
        UserService,
        MetaService,
        EventsService,
        PersonService,
        TeamService,
        ActivityCfgService,
        APIStatsService,
        CollectService,
        EffectiveService,
        CommonService,
        FileTransfer,

    ]
})
export class APIModule {
}
