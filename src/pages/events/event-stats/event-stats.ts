import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StatsEventService } from '../stats.event.service';
import { StatsContainerModel } from 'model/stats.container';

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
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {StatsEventService} statsEventService
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private statsEventService: StatsEventService) {
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
    ionViewDidLoad() {
        console.log('ionViewDidLoad EventStatsPage');
    }

    /**
     *
     */
    deleteCollect() {
        console.log('deleteCollect EventStatsPage');
    }

}
