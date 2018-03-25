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
