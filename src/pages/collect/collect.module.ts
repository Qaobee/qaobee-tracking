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

@NgModule({
  declarations: [
    TeamBuildPage,
    CollectPage,
    GoalModal,
    SubstitutionModal,
    StatsModal,
    TeamBuildComponent
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
    StatsModal
  ]
})

export class CollectModule {
}
