import {NgModule} from '@angular/core';
import {MenuHeaderComponent} from './menu-header/menu-header';
import {IonicModule} from "ionic-angular";
import {MyApp} from "../app/app.component";

@NgModule({
    declarations: [MenuHeaderComponent],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    exports: [MenuHeaderComponent]
})
export class ComponentsModule {
}
