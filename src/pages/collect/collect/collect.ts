import { StatType } from './../../../model/stat.type';
import { Observable } from 'rxjs';
import { GamePhase } from './../../../model/game.phase';
import { FSMStates } from './../../../model/fsm/fsm.states';
import { FSMEvents } from './../../../model/fsm/fsm.events';
import { FSMContext } from './../../../model/fsm/fsm.context';
import { StatCollector } from './../../../providers/collect/stat.collector';
import { ChronoComponent } from './../../../components/chrono/chrono.component';
import { CollectStat } from './../../../model/collect.stat';
import { InGamePlayer } from './../../../model/ingame.player';
import { GameState } from './../../../model/game.state';
import { HandFSM } from './../../../providers/collect/hand.fsm';
import { Utils } from './../../../providers/utils';
import { AuthenticationService } from './../../../providers/authentication.service';
import { APIStatsService } from './../../../providers/api/api.stats';
import { Storage } from '@ionic/storage';
import { NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { MessageBus } from './../../../providers/message-bus.service';
import { Component } from "@angular/core";
import { ENV } from "@app/env";
import moment from 'moment';

@Component({
    selector: 'page-collect',
    templateUrl: 'collect.html',
})
export class CollectPage {
    STATS_TO_DISPLAY: number = 5;
    root: string = ENV.hive;

    fsmContext = new FSMContext();
    NA = 'na'
    gameState: GameState = new GameState();
    currentEvent: any;
    currentCollect: any;
    playerMap: any = {};
    playerList: Array<InGamePlayer> = [];
    indicatorsByCode: any = {};
    mapIndicators: any = {};
    possibleActions: any = {};
    gameSystem: string[] = [];
    stats: Array<CollectStat> = [];
    displayedStats: Array<CollectStat> = [];
    playerPositions: any = {
        substitutes: []
    };
    attackEnabled = true;
    defenseEnabled = true;

    positiveActions: any[] = [];
    negativeActions: any[] = [];

    ground = [
        [{ key: 'pivot', label: 'Pivot', class: 'blue-grey' }],
        [
            { key: 'left-backcourt', label: 'Back-court', class: 'white' },
            { key: 'center-backcourt', label: 'Back-court', class: 'white' },
            { key: 'right-backcourt', label: 'Back-court', class: 'white' }
        ],
        [
            { key: 'left-wingman', label: 'Wing-man', class: 'white' },
            { key: 'goalkeeper', label: 'Goalkeeper', class: 'red' },
            { key: 'right-wingman', label: 'Wing-man', class: 'white' }
        ]
    ];


    /**
     * @param  {NavParams} publicnavParams
     * @param  {Storage} privatestorage
     * @param  {ToastController} privatetoastCtrl
     * @param  {LoadingController} publicloadingCtrl
     * @param  {MessageBus} privatemessageBus
     * @param  {APIStatsService} privatestatAPI
     * @param  {StatCollector} privatestatCollector
     * @param  {Utils} privateutils
     * @param  {AuthenticationService} privateauthenticationService
     * @param  {HandFSM} privatehandFSM
     */
    constructor(
        public navParams: NavParams,
        private storage: Storage,
        private toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController,
        private messageBus: MessageBus,
        private statAPI: APIStatsService,
        private statCollector: StatCollector,
        private utils: Utils,
        private authenticationService: AuthenticationService,
        private handFSM: HandFSM
    ) {
        this.currentEvent = navParams.get('event');
        this.playerPositions = navParams.get('players') || {};
        this.currentCollect = navParams.get('collect');
        console.debug('[CollectPage] - constructor', 'currentEvent', this.currentEvent, 'playerPositions', this.playerPositions, 'currentCollect', this.currentCollect);
        this.getStatisticsConfigAPI();

        this.messageBus.on(StatCollector.STAT, stat => {
            console.debug('[CollectPage] - constructor - onStatCollector.STAT', stat);
            this.stats.push(stat);
            this.displayedStats = this.stats.slice(Math.max(this.stats.length - this.STATS_TO_DISPLAY, 0), this.stats.length);
            this.displayedStats.reverse();
            this.saveSats();
        })

        this.messageBus.on(HandFSM.GAME_STATE, evt => {
            console.debug('[CollectPage] - constructor - onHandFSM.GAME_STATE', evt);
            this.handFSM.context.state = evt.state;
            this.saveState();
        });

        this.messageBus.on(HandFSM.SWITCH_PHASE, evt => {
            console.debug('[CollectPage] - constructor - onHandFSM.SWITCH_PHASE', evt);
            if (evt.attack) {
                this.doAttack();
            } else {
                this.doDefense();
            }
        });

        this.messageBus.on(HandFSM.ROLLBACK, evt => {
            console.debug('[CollectPage] - constructor - onHandFSM.ROLLBACK', evt);
            this.stats = this.stats.slice(0, Math.max(this.stats.length - 2, this.stats.length - 1));
            this.displayedStats = this.stats.slice(Math.max(this.stats.length - this.STATS_TO_DISPLAY, 0), this.stats.length);
            this.displayedStats.reverse();
        });
        // this.initGoalArea();
        // this.initGroundArea();
    }
    getColor(playerId: string, defClass: string) {
        //  console.debug('[CollectPage] - getColor', playerId, this.fsmContext.selectedPlayer)
        if (this.fsmContext && this.fsmContext.selectedPlayer && playerId === this.fsmContext.selectedPlayer.playerId) {
            return 'secondary'
        } else if (defClass) {
            return defClass;
        }
    }

    /**
     * 
     */
    saveSats(): void {
        this.storage.set('stats-' + this.currentEvent._id, this.stats);
        this.saveState();
    }

    /**
     * 
     */
    saveState(): void {
        console.debug('[CollectPage] - saveState', this.fsmContext)
        this.gameState.lastInMap = this.fsmContext.lastInMap;
        this.gameState.playTimeMap = this.fsmContext.playTimeMap;
        this.gameState.chrono = this.fsmContext.chrono;
        this.gameState.playerList = this.playerList;
        if (this.handFSM.context) {
            this.gameState.state = this.handFSM.context.state;
        }
        // TODO gestion des timeouts
        this.gameState.positions = this.playerPositions;
        this.storage.set('gameState-' + this.currentEvent._id, this.gameState);
        console.debug('[CollectPage] - saveState', this.gameState)
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
        this.gameState.homeGameSystem = this.gameSystem[0];
        this.gameState.visitorGameSystem = this.gameSystem[0];
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

    /**
     * 
     */
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

    /**
     * 
     */
    restoreState() {
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        this.playerMap = {};

        this.storage.get('gameState-' + this.currentEvent._id).then((gameState: GameState) => {
            console.debug('[CollectPage] - restoreState - gameState from storage', gameState);
            if (gameState) {
                this.gameState = gameState;
                this.fsmContext.lastInMap = this.gameState.lastInMap;
                this.fsmContext.playTimeMap = this.gameState.playTimeMap;
                this.fsmContext.chrono = this.gameState.chrono;
                this.handFSM.initialState = this.gameState.state;
                this.playerList = this.gameState.playerList;
                this.playerList.forEach(k => {
                    console.debug('[CollectPage] - restoreState - gameState from storage - playerList', k);
                    this.playerMap[k.playerId] = k;
                });
                // TODO gestion des timeouts
                this.playerPositions = this.gameState.positions;
                this.ground = Object.assign([], this.ground);
                this.gameState.sanctions.forEach(s => {
                    if (this.playerMap[s.playerId].holder) {
                        this.playerMap[s.playerId].sanction = s.sanction;
                    }
                });
                this.storage.get('stats-' + this.currentEvent._id).then((stats: CollectStat[]) => {
                    this.setStats(stats || []);
                });
                this.handFSM.start(this.fsmContext);
                //  this.fsmContext.paused = false;
                // this.fsmContext.gameStarted = true;
                this.handFSM.saveState(this.fsmContext);
                //  this.messageBus.broadcast(ChronoComponent.PLAY, {});
                loader.dismiss();
                console.debug('[CollectPage] - restoreState - fetch context', 'fsmContext', this.fsmContext, 'gameState', this.gameState);
            } else {
                console.debug('[CollectPage] - gameStates - new collect', 'playerPositions', this.playerPositions, 'playerList', this.playerList);
                this.gameState = new GameState();
                this.gameState.eventId = this.currentEvent._id;
                Object.keys(this.playerPositions).forEach(k => {
                    if (k === 'substitute') {
                        this.playerPositions[k].forEach(p => {
                            let inGamePlayer = new InGamePlayer();
                            inGamePlayer.playerId = p._id;
                            inGamePlayer.position = k;
                            this.playerMap[inGamePlayer.playerId] = inGamePlayer;
                            this.statCollector.substitute(this.fsmContext, p._id);
                            this.playerList.push(inGamePlayer);
                        });
                    } else {
                        let inGamePlayer = new InGamePlayer();
                        inGamePlayer.playerId = this.playerPositions[k]._id;
                        inGamePlayer.position = k;
                        this.playerMap[inGamePlayer.playerId] = inGamePlayer;
                        this.statCollector.holder(this.fsmContext, this.playerPositions[k]._id, k);
                        inGamePlayer.holder = true;
                        this.playerList.push(inGamePlayer);
                    }
                });
                this.handFSM.start(this.fsmContext);
                loader.dismiss();
                this.saveSats();
                console.debug('[CollectPage] - gameStates - new collect', 'fsmContext', this.fsmContext, 'gameState', this.gameState);
            }
        });
    }

    setStats(stats: CollectStat[]) {
        console.debug('[CollectPage] - setStats', stats);
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
        // console.debug('[CollectPage] - getAvatar', avatar);
        if (avatar && avatar !== 'null') {
            return this.root + '/file/SB_Person/' + avatar;
        } else {
            return '/assets/imgs/user.png';
        }
    }

    getTeamHomeName(): string {
        // console.debug('[CollectPage] - getTeamHomeName');
        if (this.currentEvent.participants.teamHome) {
            return this.currentEvent.participants.teamHome.label || this.NA;
        }
        return this.NA;
    }

    getTeamHomeId() {
        //  console.debug('[CollectPage] - getTeamHomeId');
        if (this.currentEvent.participants.teamHome) {
            return this.currentEvent.participants.teamHome.id || this.NA;
        }
        return this.NA;
    }

    getTeamVisitor(): string {
        //    console.debug('[CollectPage] - getTeamVisitor');
        if (this.currentEvent.participants.teamVisitor) {
            return this.currentEvent.participants.teamVisitor.label || this.NA;
        }
        return this.NA;
    }

    getGaolkeeperId(): string {
        console.debug('[CollectPage] - getGaolkeeperId');
        this.playerList.forEach((p: InGamePlayer) => {
            if (p.holder) {
                if ("goalkeeper" === p.position) {
                    console.debug('[CollectPage] - getGaolkeeperId', p.playerId);
                    return p.playerId;
                }
            }
        });
        return undefined;
    }

    closeSubstitues() {
        console.debug('[CollectPage] - closeSubstitues');
        //TODO
    }

    penaltyButton() {
        console.debug('[CollectPage] - penaltyButton');
        // TODO
        if (this.fsmContext.gamePhase && this.fsmContext.gamePhase.attack) {
            this.handFSM.trigger(FSMEvents.groundAtt);
            /*
             handGround.setVisibility(View.INVISIBLE);
            hand_ground.setVisibility(View.INVISIBLE);
            eventHelper.ground(context, "originShootAtt", "PENALTY", context.getSelectedPlayer());
            showGoal();
            */
        } else if (this.fsmContext.gamePhase && !this.fsmContext.gamePhase.attack) {
            this.handFSM.trigger(FSMEvents.groundDef);
            /*
            handGround.setVisibility(View.INVISIBLE);
            hand_ground.setVisibility(View.INVISIBLE);
            eventHelper.ground(context, "originShootDef", "PENALTY", getGaolkeeperId());
            context.safeTrigger(HandFSM.Events.groundDef);
            showGoal();
            */
        }
    }

    showGoal() {
        console.debug('[CollectPage] - showGoal');
        // TODO
    }
    hideGoal() {
        console.debug('[CollectPage] - hideGoal');
        this.hideGround();
    }
    showGround() {
        console.debug('[CollectPage] - showGround');
        //TODO
    }
    hideGround() {
        console.debug('[CollectPage] - hideGround');
        // TODO
    }
    showGoalBtns() {
        console.debug('[CollectPage] - showGoalBtns');
        // TODO
    }

    stopShootButton() {
        console.debug('[CollectPage] - stopShootButton');
        let fsmEvent = this.fsmContext.gamePhase.attack ? FSMEvents.stopShootAtt : FSMEvents.stopShootDef;
        let fsmPhase = this.fsmContext.gamePhase.attack ? FSMEvents.doDefense : FSMEvents.doAttack;
        this.handFSM.trigger(fsmEvent);
        console.debug('[CollectPage] - stopShootButton - gamePhase', this.fsmContext.gamePhase.attack);
        if (this.fsmContext.gamePhase.attack) {
            this.statCollector.stopShoot(this.fsmContext, undefined);
            this.fsmContext.selectedPlayer = undefined;
            this.doDefense();
        } else {
            this.statCollector.stopShoot(this.fsmContext, this.getGaolkeeperId());
            this.doSelectGoalKeeper();
            this.doAttack();
        }
        this.fsmContext.shootSeqId = undefined;
        this.handFSM.trigger(fsmPhase);
        console.debug('[CollectPage] - stopShootButton - fsmContext', this.fsmContext);
        this.saveState();
        this.clearGround();
        this.clearGoal();
        this.hideGoal();
    }

    goalButton() {
        console.debug('[CollectPage] - goalButton');
        if (!this.fsmContext.gamePhase) {
            return;
        }
        let fsmEvent = this.fsmContext.gamePhase.attack ? FSMEvents.goalScoredAtt : FSMEvents.goalScoredDef;
        let fsmPhase = this.fsmContext.gamePhase.attack ? FSMEvents.doDefense : FSMEvents.doAttack;
        let wasAttack = this.fsmContext.gamePhase.attack;
        this.handFSM.trigger(fsmEvent);
        if (wasAttack) {
            this.gameState.homeScore++;
            this.statCollector.goalScored(this.fsmContext, this.fsmContext.selectedPlayer)
            this.doDefense();
        } else {
            this.gameState.visitorScore++;
            this.statCollector.goalConceded(this.fsmContext, this.fsmContext.selectedPlayer);
            this.doAttack();
        }
        this.fsmContext.shootSeqId = undefined;
        this.handFSM.trigger(fsmPhase);
        this.saveState();
        this.clearGround();
        this.clearGoal();
        this.hideGoal();
    }

    doSelectGoalKeeper() {
        console.debug('[CollectPage] - doSelectGoalKeeper');
        this.doSelectPlayer(this.getGaolkeeperId());
    }

    doSelectPlayer(playerId: string) {
        console.debug('[CollectPage] - doSelectPlayer', playerId, this.playerMap, this.playerMap[playerId]);
        this.handFSM.trigger(FSMEvents.selectPlayer);
        if (this.fsmContext.selectedPlayer) {
            this.statCollector.makePass(this.fsmContext, this.fsmContext.selectedPlayer.playerId, playerId);
        }
        this.fsmContext.selectedPlayer = this.playerMap[playerId];
    }

    resume() {
        console.debug('[CollectPage] - resume', this.fsmContext.gamePhase);
        if (!this.fsmContext.gamePhase) {
            this.handFSM.trigger(FSMEvents.startChrono);
        } else if (this.fsmContext.gamePhase.attack) {
            this.handFSM.trigger(FSMEvents.doAttack);
            this.doAttack();
        } else {
            this.handFSM.trigger(FSMEvents.doDefense);
            this.doDefense();
        }
    }

    playButton(event: number) {
        console.debug('[CollectPage] - playButton', event);
        if (this.handFSM.context.state === FSMStates.GAME_ENDED) {
            this.presentToast('Collect is over');
            return;
        } else if (this.handFSM.context.state === FSMStates.INIT) {
            this.startCollect();
            this.handFSM.trigger(FSMEvents.startChrono);
        } else {
            this.handFSM.trigger(FSMEvents.resume);
            this.resume();
        }
        this.fsmContext.paused = false;
    }

    pauseButton(event: number) {
        console.debug('[CollectPage] - pauseButton', event);
        this.handFSM.trigger(FSMEvents.doPause);
        this.fsmContext.paused = true;
    }

    startCollect() {
        console.debug('[CollectPage] - startCollect');
        this.currentCollect.startDate = Date.now();
        this.currentCollect.status = 'inProgress';
        this.storage.get('collects').then((collects: any) => {
            (collects || {})[this.currentCollect._id] = this.currentCollect;
            this.storage.set('collects', collects);
        });
    }

    attackButton(event: any) {
        console.debug('[CollectPage] - attackButton', event);
        this.handFSM.trigger(FSMEvents.doAttack);
        this.doAttack();
    }

    doAttack() {
        console.debug('[CollectPage] - doAttack');
        this.fsmContext.phaseSeqId = this.utils.generateGUID();
        this.fsmContext.gamePhase = new GamePhase();
        this.fsmContext.gamePhase.attack = true;
        this.fsmContext.gamePhase.code = StatType.TIME_ATTACK;
        this.fsmContext.gamePhase.startTime = this.fsmContext.chrono;
        this.attackEnabled = false;
        this.defenseEnabled = true;
        this.clearGround();
        this.clearGoal();
        this.hideGoal();
        this.populateActions('attack');
    }

    defenseButton(event: any) {
        console.debug('[CollectPage] - defenseButton', event);
        this.handFSM.trigger(FSMEvents.doDefense);
        this.doDefense();
    }


    doDefense() {
        console.debug('[CollectPage] - doDefense');
        this.fsmContext.phaseSeqId = this.utils.generateGUID();
        this.fsmContext.gamePhase = new GamePhase();
        this.fsmContext.gamePhase.attack = false;
        this.fsmContext.gamePhase.code = StatType.TIME_DEFENSE;
        this.fsmContext.gamePhase.startTime = this.fsmContext.chrono;
        this.attackEnabled = true;
        this.defenseEnabled = false;
        this.clearGround();
        this.clearGoal();
        this.hideGoal();
        this.populateActions('defense');
    }

    hurtButton(event: any) {
        console.debug('[CollectPage] - hurtButton', event);
        this.messageBus.broadcast(ChronoComponent.PAUSE, {});
        this.statCollector.wound(this.fsmContext, this.fsmContext.selectedPlayer);
    }

    orangeCardButton(event: any) {
        console.debug('[CollectPage] - orangeCardButton', event);
        if (this.fsmContext.selectedPlayer && this.playerMap[this.fsmContext.selectedPlayer].sanction !== StatType.ORANGE_CARD) {
            this.handFSM.trigger(FSMEvents.sanction);
            this.playerMap[this.fsmContext.selectedPlayer].sanction = StatType.ORANGE_CARD;
            this.statCollector.card(this.fsmContext, StatType.ORANGE_CARD, this.fsmContext.selectedPlayer);
            this.gameState.sanctions.push({ playerId: this.fsmContext.selectedPlayer, sanction: StatType.ORANGE_CARD });
            this.saveState();
            this.startOrangeCardTimer(this.fsmContext.selectedPlayer);
        }
    }

    //OrangeCardEndEvent
    onOrangeCardEndEvent(playerId: string) {
        console.debug('[CollectPage] - onOrangeCardEndEvent', playerId);
        this.gameState.sanctions = this.gameState.sanctions.filter(s => {
            return s.playerId !== playerId;
        });
        this.saveState();
    }

    //UploadStatEvent
    onUploadStatEvent() {
        console.debug('[CollectPage] - onUploadStatEvent');
        this.saveState();
        this.uploadStats();
    }

    yellowCardButton(event: any) {
        console.debug('[CollectPage] - yellowCardButton', event);
        if (this.fsmContext.selectedPlayer && this.playerMap[this.fsmContext.selectedPlayer].sanction !== StatType.YELLOW_CARD) {
            this.handFSM.trigger(FSMEvents.sanction);
            this.playerMap[this.fsmContext.selectedPlayer].sanction = StatType.YELLOW_CARD;
            this.statCollector.card(this.fsmContext, StatType.YELLOW_CARD, this.fsmContext.selectedPlayer);
            this.gameState.sanctions.push({ playerId: this.fsmContext.selectedPlayer, sanction: StatType.YELLOW_CARD });
            this.saveState();
        }
    }

    redCardButton(event: any) {
        console.debug('[CollectPage] - redCardButton', event);
        if (this.fsmContext.selectedPlayer && this.playerMap[this.fsmContext.selectedPlayer].sanction !== StatType.RED_CARD) {
            this.handFSM.trigger(FSMEvents.sanction);
            this.playerMap[this.fsmContext.selectedPlayer].sanction = StatType.RED_CARD;
            this.statCollector.card(this.fsmContext, StatType.RED_CARD, this.fsmContext.selectedPlayer);
            this.gameState.sanctions.push({ playerId: this.fsmContext.selectedPlayer, sanction: StatType.RED_CARD });
            this.playerMap[this.fsmContext.selectedPlayer].holder = false;

            let lastIn = this.fsmContext.lastInMap[this.fsmContext.selectedPlayer] || 0;
            let totalPlayTime = this.fsmContext.playTimeMap[this.fsmContext.selectedPlayer] || 0;
            this.fsmContext.playTimeMap[this.fsmContext.selectedPlayer] = totalPlayTime + this.fsmContext.chrono - lastIn;
            this.statCollector.totalPlayTime(this.fsmContext, this.fsmContext.selectedPlayer);
            this.saveState();
            this.startRedCardTimer(this.playerMap[this.fsmContext.selectedPlayer].position);
        }
    }

    startRedCardTimer(position: string) {
        console.debug('[CollectPage] - startRedCardTimer', position);
        Observable.interval(1000 * 60 * 2)
            .subscribe(i => {
                // TODO
            });
    }

    startOrangeCardTimer(playerId: string) {
        console.debug('[CollectPage] - startYellowCardTimer', playerId);
        Observable.interval(1000 * 60 * 2)
            .subscribe(i => {
                this.onOrangeCardEndEvent(playerId);
            });
    }

    timeoutThem(event: any) {
        console.debug('[CollectPage] - timeoutThem', event);
        // TODO bloquer le check
        if (this.fsmContext.paused) {
            // uncheck
            return;
        }
        this.handFSM.trigger(FSMEvents.timeout);
        this.messageBus.broadcast(ChronoComponent.PAUSE, {});
        this.statCollector.deadTime(this.fsmContext, StatType.TIMEOUT_THEM, this.getTeamVisitor());
        this.gameState.visitorTimeout++;
        this.saveSats();
    }

    timeoutUs(event: any) {
        console.debug('[CollectPage] - timeoutUs', event);
        // TODO bloquer le check
        if (this.fsmContext.paused) {
            // uncheck
            return;
        }
        this.handFSM.trigger(FSMEvents.timeout);
        this.messageBus.broadcast(ChronoComponent.PAUSE, {});
        this.statCollector.deadTime(this.fsmContext, StatType.TIMEOUT_US, this.getTeamHomeId());
        this.gameState.homeTimeout++;
        this.saveSats();
    }

    toggleSubstitues(event: any) {
        console.debug('[CollectPage] - toggleSubstitues', event);
        // TODO
    }

    onBackPressed(event: any) {
        console.debug('[CollectPage] - onBackPressed', event);
        // TODO
    }

    closeIndicatorPanel(event: any) {
        console.debug('[CollectPage] - closeIndicatorPanel', event);
        // TODO
    }

    positiveActionButton(event: any) {
        console.debug('[CollectPage] - positiveActionButton', event);
        if (!this.fsmContext.gamePhase) {
            // TODO i18n
            this.presentToast('Choose a game phase (attack or defense)');
        } else if (!this.fsmContext.selectedPlayer) {
            // TODO i18n
            this.presentToast('You must select a player');
        } else {
            let buttons = [];
            this.positiveActions.forEach(a => {
                buttons.push({
                    text: a.code,
                    handler: () => {
                        this.statCollector.makeAction(this.fsmContext, a.code, this.fsmContext.selectedPlayer);
                        if (!this.fsmContext.gamePhase.attack && ! 'neutralization' === a.code) {
                            this.handFSM.trigger(FSMEvents.doAttack);
                        }
                    }
                });
            });
            buttons.push({
                text: 'Cancel',
                role: 'cancel'
            });
            let actionSheet = this.actionSheetCtrl.create({
                title: 'Select a positive action',
                buttons: buttons
            });
            actionSheet.present();
        }
    }
    /**
     * @param  {any} event
     */
    negativeActionButton(event: any) {
        console.debug('[CollectPage] - negativeActionButton', event);
        if (!this.fsmContext.gamePhase) {
            // TODO i18n
            this.presentToast('Choose a game phase (attack or defense)');
        } else if (!this.fsmContext.selectedPlayer) {
            // TODO i18n
            this.presentToast('You must select a player');
        } else {
            let buttons = [];
            this.negativeActions.forEach(a => {
                buttons.push({
                    text: a.code,
                    handler: () => {
                        this.statCollector.makeAction(this.fsmContext, a.code, this.fsmContext.selectedPlayer);
                        this.fsmContext.selectedPlayer = undefined;
                        this.handFSM.trigger(FSMEvents.doDefense);
                    }
                });
            });
            buttons.push({
                text: 'Cancel',
                role: 'cancel'
            });
            let actionSheet = this.actionSheetCtrl.create({
                title: 'Select a negative action',
                buttons: buttons
            });
            actionSheet.present();
        }
    }

    populateActions(phase: string) {
        console.debug('[CollectPage] - populateActions', phase);
        this.positiveActions = this.possibleActions[phase].positive;
        this.negativeActions = this.possibleActions[phase].negative;
        // gérer le goal ???
        console.debug('[CollectPage] - populateActions', this.positiveActions, this.negativeActions);

    }

    endPeriod(event: any) {
        console.debug('[CollectPage] - endPeriod', event);
        this.fsmContext.paused = true;
        this.gameState.state = this.handFSM.context.state;
        this.saveState();
        // bus.post(gameState); ?
    }

    endCollect() {
        console.debug('[CollectPage] - endCollect');
        this.fsmContext.paused = false;
        this.gameState.state = this.handFSM.context.state;
        this.saveState();
        this.presentToast('Game over');
    }


    statsButton(event: any) {
        console.debug('[CollectPage] - statsButton', event);
        // TODO
    }

    stopButton(event: any) {
        console.debug('[CollectPage] - stopButton', event);
        // TODO
    }

    uploadStats() {
        console.debug('[CollectPage] - uploadStats')
        // TODO
    }
    clearGround() {
        console.debug('[CollectPage] - clearGround')
        // TODO
    }
    clearGoal() {
        console.debug('[CollectPage] - clearGoal')
        // TODO
    }
    /**
    *
    * @param msg
    */
    private presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
}