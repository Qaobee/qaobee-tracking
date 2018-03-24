import {NgModule} from '@angular/core';
import {EventListPage} from "./event-list/event-list";
import {KeysPipe} from "../../pipes/keys.pipe";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {ComponentsModule} from "../../components/components.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {App, IonicModule} from "ionic-angular";
import {EventDetailPage} from "./event-detail/event-detail";
@NgModule({
    declarations: [
        EventListPage,
        EventDetailPage,
        KeysPipe
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
        })
    ],
    entryComponents: [
        EventListPage,
        EventDetailPage
    ]
})

export class EventsModule {
}
