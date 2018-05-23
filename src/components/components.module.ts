import { NgModule } from '@angular/core';
import { MenuHeaderComponent } from './menu-header/menu-header';
import { IonicModule } from "ionic-angular";
import { MyApp } from "../app/app.component";
import { NextEventComponent } from './next-event/next-event';
import { LastCollectComponent } from './last-collect/last-collect';
import { Utils } from "../providers/utils";
import { APIModule } from "../providers/api/api.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../app/app.module";
import { HttpClient } from "@angular/common/http";
import { ChronoComponent } from "./chrono/chrono.component";
import { SassHelperComponent } from './sass-helper.component';
import { StatsShootEfficiencyComponent } from './stats-shoot-efficiency/stats-shoot-efficiency';
import { StatsHighligthsByQuarterComponent } from './stats-highligths-by-quarter/stats-highligths-by-quarter';
import { StatsCollectTimeSheetComponent } from './stats-collect-time-sheet/stats-collect-time-sheet';

@NgModule({
    declarations: [
        MenuHeaderComponent,
        NextEventComponent,
        LastCollectComponent,
        SassHelperComponent,
        ChronoComponent,
        StatsShootEfficiencyComponent,
        StatsHighligthsByQuarterComponent,
        StatsCollectTimeSheetComponent
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        APIModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [ HttpClient ]
            }
        })
    ],
    exports: [
        MenuHeaderComponent,
        NextEventComponent,
        LastCollectComponent,
        ChronoComponent,
        SassHelperComponent,
        StatsShootEfficiencyComponent,
        StatsHighligthsByQuarterComponent,
        StatsCollectTimeSheetComponent
    ],
    providers: [
        Utils
    ]
})
export class ComponentsModule {
}
