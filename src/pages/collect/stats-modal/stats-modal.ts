import { GameState } from '../../../model/game.state';
import { ViewController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
    selector: 'stats-modal',
    templateUrl: 'stats-modal.html'
})
export class StatsModal {
    playerList: any[];
    event: any;
    collect: any;
    ownerId: any[] = [];
    stats: any[] = [];
    scoreHome: number = 0;
    scoreVisitor: number = 0;
    statsNotFound: boolean = false;

    /**
     *
     * @param {ViewController} viewCtrl
     * @param {NavParams} params
     */
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        this.playerList = this.params.get('playerList');
        this.event = this.params.get('event');
        this.collect = this.params.get('collect');
        this.stats = this.params.get('stats');
        let gameState: GameState = this.params.get('gameState');
        this.scoreHome = gameState.homeScore;
        this.scoreVisitor = gameState.visitorScore;
        this.playerList.forEach(p => {
            this.ownerId.push(p._id);
        });
        console.debug('[StatsModal] - constructor', this.playerList, this.event, this.stats, this.ownerId);
    }

    /**
     *
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }
}