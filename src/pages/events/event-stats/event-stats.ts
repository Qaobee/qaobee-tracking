import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { APIStatsService } from '../../../providers/api/api.stats';
import { AuthenticationService } from '../../../providers/authentication.service';
import { CollectService } from '../../../providers/api/api.collect.service';

@Component({
  selector: 'page-event-stats',
  templateUrl: 'event-stats.html',
})
export class EventStatsPage {

  event: any;
  collect: any;
  ownerId: any[] = [];
  scoreHome: number = 0;
  scoreVisitor: number = 0;
  statsNotFound: boolean = false;

  /**
   *
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private collectService: CollectService,
              private authenticationService: AuthenticationService,
              private statsService: APIStatsService) {
    this.event = navParams.get('event');
    this.ownerId.push(this.event._id);
    this.retriveCollects(this.event);
    this.getStats();
  }

  /**
   * Get collect for an event
   * @param event 
   */
  private retriveCollects(event: any[]) {
      this.collectService.getCollects(
        this.authenticationService.meta._id,
        this.event._id, null, null,
        this.authenticationService.meta.season.startDate,
        this.authenticationService.meta.season.endDate
      ).subscribe((collects: any[]) => {
        if(collects.length>0) {
          this.collect = collects[0];
        }
      });
  }

  /**
   * Get list of stats for an event
   */
  getStats(){                   
    let indicators = ['goalScored', 'goalConceded' ];
    let search = {
      listIndicators: indicators,
      listOwners: this.ownerId,
      startDate: this.authenticationService.meta.season.startDate,
      endDate: this.authenticationService.meta.season.endDate,
      aggregat: 'COUNT'
    };

    this.statsService.getListDetailValue(search).subscribe((result: any[]) => {
      if(result.length>0){
        this.statsNotFound = false;
        let goalConceded = 0;
        let goalScored = 0;
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          if(element.code==='goalConceded'){
            goalConceded = goalConceded +1
          }

          if(element.code==='goalScored'){
            goalScored = goalScored +1
          }
        }

        // Gestion score en fonction match à domicile ou extérieur
        if(this.event.participants.teamHome.adversary){
          this.scoreHome = goalConceded;
          this.scoreVisitor = goalScored;
        } else {
          this.scoreVisitor = goalConceded;
          this.scoreHome = goalScored;
        }
      } 
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventStatsPage');
  }

  deleteCollect() {
    console.log('deleteCollect EventStatsPage');
  }

}
