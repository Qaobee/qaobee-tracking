import {NgModule} from '@angular/core';
import {MenuHeaderComponent} from './menu-header/menu-header';
import {IonicModule} from "ionic-angular";
import {MyApp} from "../app/app.component";
import { LastEventComponent } from './last-event/last-event';
import { LastCollectComponent } from './last-collect/last-collect';

@NgModule({
    declarations: [MenuHeaderComponent,
    LastEventComponent,
    LastCollectComponent],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    exports: [MenuHeaderComponent,
    LastEventComponent,
    LastCollectComponent]
})
export class ComponentsModule {
}
