import {NgModule} from '@angular/core';
import {MenuHeaderComponent} from './menu-header/menu-header';
import {IonicModule} from "ionic-angular";
import {MyApp} from "../app/app.component";
import {NextEventComponent} from './next-event/next-event';
import {LastCollectComponent} from './last-collect/last-collect';
import {Utils} from "../providers/utils";
import {APIModule} from "../providers/api/api.module";

@NgModule({
    declarations: [MenuHeaderComponent,
    NextEventComponent,
    LastCollectComponent],
    imports: [
        IonicModule.forRoot(MyApp),
        APIModule
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
