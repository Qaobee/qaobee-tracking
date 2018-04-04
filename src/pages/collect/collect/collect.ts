import { ChronoComponent } from './../../../components/chrono/chrono.component';
import { CollectStat } from './../../../model/collect.stat';
import { InGamePlayer } from './../../../model/ingame.player';
import { GameState } from './../../../model/game.state';
import { FSMContext } from './../../../model/fsm.context';
import { HandFSM } from './../../../providers/collect/hand.fsm';
import { Utils } from './../../../providers/utils';
import { AuthenticationService } from './../../../providers/authentication.service';
import { APIStatsService } from './../../../providers/api/api.stats';
import { Storage } from '@ionic/storage';
import { NavParams, ToastController, LoadingController } from 'ionic-angular';
import { MessageBus } from './../../../providers/message-bus.service';
import { Component } from "@angular/core";
import { ENV } from "@app/env";

@Component({
    selector: 'page-collect',
    templateUrl: 'collect.html',
})
export class CollectPage {
    STATS_TO_DISPLAY: number = 5;
    currentPhase: number;
    root: string = ENV.hive;
    fsmContext = new FSMContext();
    NA = 'na'
    gameState: GameState;
    currentEvent: any;
    playerMap: any;
    playerList: InGamePlayer[] = [];
    indicatorsByCode: any = {};
    mapIndicators: any = {};
    possibleActions: any = {};
    gameSystem: string[] = [];
    stats: CollectStat[];
    displayedStats: CollectStat[];
    chrono: number = 0;
    homeScore: number = 0;
    visitorScore: number = 0;
    playerPositions: any = {
        substitutes: []
    };

    ground = [
        [{ key: 'pivot', label: 'Pivot', class: 'pivot' }],
        [{ key: 'left-backcourt', label: 'Back-court', class: '' }, {
            key: 'center-backcourt',
            label: 'Back-court'
        }, { key: 'right-backcourt', label: 'Back-court' }],
        [{ key: 'left-wingman', label: 'Wing-man' }, { key: 'goalkeeper', label: 'Goalkeeper', class: 'goalkeeper' }, {
            key: 'right-wingman',
            label: 'Wing-man'
        }]
    ];

    constructor(
        public navParams: NavParams,
        private storage: Storage,
        private toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        private messageBus: MessageBus,
        private statAPI: APIStatsService,
        private utils: Utils,
        private authenticationService: AuthenticationService,
        private handFSM: HandFSM
    ) {
        this.currentEvent = navParams.get('event');
        this.playerList = navParams.get('players');
        console.debug('[CollectPage] - constructor', 'currentEvent', this.currentEvent, 'playerList', this.playerList);
        this.getStatisticsConfigAPI();
        // this.initGoalArea();
        // this.initGroundArea();
    }

    /**
     * 
     */
    getStatisticsConfigAPI() {
        let listIndicators = this.storage.get('listIndicators').then(list => {
            console.debug('[CollectPage] - getStatisticsConfigAPI - from storage', list);
            if (!list || list.length == 0) {
                this.statAPI.getListIndicators(this.authenticationService.meta.activity._id, this.authenticationService.meta.season.countryId, ['COLLECTE'])
                    .subscribe((res: any[]) => {
                        console.debug('[CollectPage] - getStatisticsConfigAPI - from api', res);
                        this.storage.set('listIndicators', res);
                        this.updateListIndicators(res);
                    });
            } else {
                this.updateListIndicators(list);
            }
        });
    }

    /**
     * @param  {any[]} listIndicators
     */
    updateListIndicators(listIndicators: any[]) {
        // Group by indicatorType
        this.mapIndicators = this.utils.groupBy(listIndicators, 'indicatorType');
        console.debug('[CollectPage] - updateListIndicators - mapIndicators', this.mapIndicators);
        this.indicatorsByCode = this.utils.groupBy(listIndicators, 'code');
        console.debug('[CollectPage] - updateListIndicators - indicatorsByCode', this.indicatorsByCode);
        this.gameSystem = this.indicatorsByCode.defenseSystemThem[0].listValues;
        console.debug('[CollectPage] - updateListIndicators - gameSystem', this.gameSystem);
        this.possibleActions = {
            attack: {
                positive: this.utils.filter(
                    this.mapIndicators['PERS-ACT-OFF-POS'],
                    'code',
                    ['passOk', 'goalScored', 'impactShootDef', 'stopGKAtt', 'originShootDef', 'originShootAtt', 'impactShootAtt']
                ),
                negative: this.utils.filter(
                    this.mapIndicators['PERS-ACT-OFF-NEG'],
                    'code',
                    ['shootAtt', 'impactShootDef', 'originShootDef', 'originShootAtt', 'impactShootAtt']
                )
            },
            defense: {
                positive: this.utils.filter(
                    this.mapIndicators['PERS-ACT-DEF-POS'],
                    'code',
                    ['stopOk', 'originShootDef', 'stopGKDef', 'originShootAtt', 'impactShootDef', 'impactShootAtt']
                ),
                negative: this.utils.filter(
                    this.mapIndicators['PERS-ACT-DEF-NEG'],
                    'code',
                    ['goalConceded', 'impactShootDef', 'originShootDef', 'originShootAtt', 'impactShootAtt']
                )
            }
        };
        console.debug('[CollectPage] - updateListIndicators - possibleActions', this.possibleActions);
        this.initFlowContext();
    }

    initFlowContext() {
        this.fsmContext.chrono = 0;
        this.fsmContext.eventId = this.currentEvent._id;
        this.fsmContext.owners = [
            this.currentEvent.owner.sandboxId,
            this.currentEvent.owner.effectiveId,
            this.currentEvent.owner.teamId,
            this.currentEvent._id
        ];
        this.fsmContext.connectedUser = this.authenticationService.user;
        this.fsmContext.meta = this.authenticationService.meta;
        this.fsmContext.indicators = this.indicatorsByCode;
        this.restoreState();

    }

    restoreState() {
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();

        this.storage.get('gameStates').then((gameStates: GameState[]) => {
            let res = (gameStates || []).filter(gs => {
                return gs.eventId === this.currentEvent._id;
            });
            console.debug('[CollectPage] - restoreState - gameStates from storage', res);
            if (res.length > 0) {
                this.gameState = res[0];
                this.fsmContext.lastInMap = this.gameState.lastInMap;
                this.fsmContext.playTimeMap = this.gameState.playTimeMap;
                this.fsmContext.chrono = this.gameState.chrono;
                this.chrono = this.fsmContext.chrono;
                this.handFSM.initialState = this.gameState.state;
                this.homeScore = this.gameState.homeScore;
                this.visitorScore = this.gameState.visitorScore;
                this.currentPhase = this.gameState.currentPhase;
                this.playerList = this.gameState.playerList;
                this.playerList.forEach(p => {
                    this.playerMap[p.playerId] = p;
                });
                // TODO gestion des timeouts
                this.playerPositions = this.gameState.positions;
                Object.keys(this.gameState.sanctions).forEach(k => {
                    this.gameState.sanctions[k].forEach(playerId => {
                        if (this.playerMap[playerId].holder) {
                            this.playerMap[playerId].sanction = k;
                        }
                    });
                });
                this.storage.get('stats-' + this.currentEvent._id).then((stats: CollectStat[]) => {
                    this.setStats(stats || []);
                });
                this.handFSM.start({
                    fsmContext: this.fsmContext
                })
                this.fsmContext.paused = false;
                this.fsmContext.gameStarted = true;
                this.handFSM.saveState(this.fsmContext);
                this.messageBus.broadcast(ChronoComponent.PLAY, {});
                loader.dismiss();
                console.debug('[CollectPage] - restoreState - gameStates', 'fsmContext', this.fsmContext, 'gameState', this.gameState);
            } else {
                this.gameState = new GameState();
                this.gameState.eventId = this.currentEvent._id;
                // TODO Place players
                
                console.debug('[CollectPage] - restoreState - gameStates', 'fsmContext', this.fsmContext, 'gameState', this.gameState);
            }
        });
    }

    setStats(stats: CollectStat[]) {
        this.stats = stats;
        this.displayedStats = stats.slice(Math.max(stats.length - this.STATS_TO_DISPLAY, 0), stats.length);
        this.displayedStats.reverse();
    }

    /**
     *
     * @param {string} avatar
     * @returns {string}
     */
    getAvatar(avatar: string) {
        if (avatar && avatar !== 'null') {
            return this.root + '/file/SB_Person/' + avatar;
        } else {
            return '/assets/imgs/user.png';
        }
    }

    getTeamHomeName(): string {
        if (this.currentEvent.participants.teamHome) {
            return this.currentEvent.participants.teamHome.label || this.NA;
        }
        return this.NA;
    }

    getTeamHomeId() {
        if (this.currentEvent.participants.teamHome) {
            return this.currentEvent.participants.teamHome.id || this.NA;
        }
        return this.NA;
    }

    getTeamVisitor(): string {
        if (this.currentEvent.participants.teamVisitor) {
            return this.currentEvent.participants.teamVisitor.label || this.NA;
        }
        return this.NA;
    }

}