import {ErrorHandler, NgModule} from "@angular/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {UserService} from "./user.service";
import {IonicErrorHandler} from "ionic-angular";
import {FileTransfer} from "@ionic-native/file-transfer";
import {MetaService} from "./meta.service";
import {EventsService} from "./events.service";

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
        UserService,
        MetaService,
        EventsService,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        FileTransfer
    ]
})

export class APIModule {
}
