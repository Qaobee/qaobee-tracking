import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { StatsEventService } from '../stats.event.service';
import { StatsContainerModel } from 'model/stats.container';
import { TranslateService } from '@ngx-translate/core';
import { CollectService } from '../../../providers/api/api.collect.service';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    selector: 'page-event-stats',
    templateUrl: 'event-stats.html',
})
export class EventStatsPage {

    statsContainer: StatsContainerModel;
    event: any = {};
    ownerId: any[] = [];
    scoreHome: number = 0;
    scoreVisitor: number = 0;
    statsNotFound: boolean = true;


    /**
     * 
     * @param navCtrl 
     * @param navParams 
     * @param statsEventService 
     * @param authenticationService 
     * @param alertCtrl 
     * @param translateService 
     * @param ga 
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private statsEventService: StatsEventService,
                private collectService: CollectService,
                private alertCtrl: AlertController,
                private translateService: TranslateService,
                private ga: GoogleAnalytics) {
        this.event = navParams.get('event');
        this.ownerId.push(this.event._id);
        if (this.event) {
            this.statsEventService.getEventStats(this.event._id).subscribe((statsContainer) => {
                this.statsContainer = statsContainer;
                if (this.statsContainer) {
                    this.getScore();
                }
            });
        }
    }

    /**
     *
     */
    ionViewDidEnter() {
        this.ga.trackView('EventStatsPage');
    }

    /**
     *
     */
    getScore() {
        if (this.statsContainer.statList.length > 0) {

            this.statsNotFound = false;
            let goalConceded = 0;
            let goalScored = 0;
            for (let index = 0; index < this.statsContainer.statList.length; index++) {
                const element = this.statsContainer.statList[ index ];
                if (element.code === 'goalConceded') {
                    goalConceded = goalConceded + 1
                }

                if (element.code === 'goalScored') {
                    goalScored = goalScored + 1
                }
            }

            // Gestion score en fonction match à domicile ou extérieur
            if (this.event.participants.teamHome.adversary) {
                this.scoreHome = goalConceded;
                this.scoreVisitor = goalScored;
            } else {
                this.scoreVisitor = goalConceded;
                this.scoreHome = goalScored;
            }
        }
    }

    /**
     *
     */
    deleteCollect(eventId: any, confirmLabels: string) {
      this.translateService.get(confirmLabels).subscribe(
        value => {
          let alert = this.alertCtrl.create({
            title: value.title,
            message: value.message,
            buttons: [
              {
                text: value.buttonLabelCancel,
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: value.buttonLabelConfirm,
                handler: () => {
                  this.collectService.deleteCollect(eventId).subscribe(r => {
                    this.navCtrl.pop();
                  });
                }
              }
            ]
          });
          alert.present();
        }
      )
    }

}
