import { APIStatsService } from './api.stats';
import {ErrorHandler, NgModule} from "@angular/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {UserService} from "./api.user.service";
import {IonicErrorHandler} from "ionic-angular";
import {FileTransfer} from "@ionic-native/file-transfer";
import {MetaService} from "./api.meta.service";
import {EventsService} from "./api.events.service";
import {PersonService} from "./api.person.service";
import {TeamService} from "./api.team.service";
import {ActivityCfgService} from "./api.activityCfg.service";
import {CollectService} from "./api.collect.service"
import {EffectiveService} from "./api.effective.service"

@NgModule({
    declarations: [    ],
    imports: [
        HttpClientModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    entryComponents: [ ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        UserService,
        MetaService,
        EventsService,
        PersonService,
        TeamService,
        ActivityCfgService,
        APIStatsService,
        CollectService,
        EffectiveService,
        FileTransfer
    ]
})

export class APIModule {
}
