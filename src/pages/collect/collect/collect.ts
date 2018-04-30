import { HomePage } from './../../home/home';
import { CollectService } from './../../../providers/api/api.collect.service';
import { Component } from '@angular/core';
import { ENV } from '@app/env';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController, LoadingController, ModalController, NavParams, ToastController, AlertController, NavController } from 'ionic-angular';
import _ from "lodash";
import moment from 'moment';
import { Observable } from 'rxjs';
import { ChronoComponent } from '../../../components/chrono/chrono.component';
import { CollectStat } from '../../../model/collect.stat';
import { FSMContext } from '../../../model/fsm/fsm.context';
import { FSMEvents } from '../../../model/fsm/fsm.events';
import { FSMStates } from '../../../model/fsm/fsm.states';
import { GamePhase } from '../../../model/game.phase';
import { GameState } from '../../../model/game.state';
import { InGamePlayer } from '../../../model/ingame.player';
import { StatType } from '../../../model/stat.type';
import { APIStatsService } from '../../../providers/api/api.stats';
import { AuthenticationService } from '../../../providers/authentication.service';
import { HandFSM } from '../../../providers/collect/hand.fsm';
import { StatCollector } from '../../../providers/collect/stat.collector';
import { MessageBus } from '../../../providers/message-bus.service';
import { Utils } from '../../../providers/utils';
import { GoalModal } from '../goal-modal/goal-modal';
import { SubstitutionModal } from '../substitution-modal/substitution-modal';
import { diff } from 'deep-object-diff';
import { StatsModal } from '../ststs-modal/stats-modal';

@Component({
  selector: 'page-collect',
  templateUrl: 'collect.html',
})
export class CollectPage {
  root: string = ENV.hive;

  fsmContext = new FSMContext();
  NA = 'na';
  gameState: GameState = new GameState();
  currentEvent: any;
  currentCollect: any;
  playerMap: any = {};
  playerList: Array<InGamePlayer> = [];
  rawPlayerList: any[];
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
  timeoutThemState: boolean[] = [false, false, false];
  timeoutUsState: boolean[] = [false, false, false];
  positiveActions: any[] = [];
  negativeActions: any[] = [];
  translations: any = {};

  ground = [
    [{ key: 'pivot', label: 'pivot', class: 'blue-grey' }],
    [
      { key: 'left-wingman', label: 'left_wingman', class: 'white' },
      { key: 'center-backcourt', label: 'center_backcourt', class: 'white' },
      { key: 'right-wingman', label: 'right_wingman', class: 'white' }
    ],
    [
      { key: 'left-backcourt', label: 'left_backcourt', class: 'white' },
      { key: 'goalkeeper', label: 'goalkeeper', class: 'indigo' },
      { key: 'right-backcourt', label: 'right_backcourt', class: 'white' }
    ]
  ];


  /**
   * @param {NavParams} navParams
   * @param {NavController} navCtrl
   * @param {Storage} storage
   * @param {ToastController} toastCtrl
   * @param {ModalController} modalController
   * @param {LoadingController} loadingCtrl
   * @param {ActionSheetController} actionSheetCtrl
   * @param {AlertController} alertCtrl
   * @param {TranslateService} translateService
   * @param {MessageBus} messageBus
   * @param {APIStatsService} statAPI
   * @param {StatCollector} statCollector
   * @param {CollectService} collectService
   * @param {AuthenticationService} authenticationService
   * @param {HandFSM} handFSM
   */
  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    private storage: Storage,
    private toastCtrl: ToastController,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private messageBus: MessageBus,
    private statAPI: APIStatsService,
    private statCollector: StatCollector,
    private collectService: CollectService,
    private authenticationService: AuthenticationService,
    private handFSM: HandFSM
  ) {
    this.translateService.get(['collect', 'loader', 'actionButton', 'warning']).subscribe(t => {
      this.translations = { collect: t.collect, loader: t.loader, actionButton: t.actionButton, warning: t.warning };
      this.currentEvent = navParams.get('event');
      this.playerPositions = navParams.get('players') || {};
      this.currentCollect = navParams.get('collect');
      this.rawPlayerList = navParams.get('playerList');
      console.debug('[CollectPage] - constructor', 'currentEvent', this.currentEvent, 'playerPositions', this.playerPositions, 'currentCollect', this.currentCollect, 'rawPlayerList', this.rawPlayerList);
      this.getStatisticsConfigAPI();
    });

    this.messageBus.on(StatCollector.STAT, stat => {
      console.debug('[CollectPage] - constructor - onStatCollector.STAT', stat);
      this.stats.push(stat);
      this.displayedStats = this.stats.slice();
      this.displayedStats.reverse();
      this.saveSats();
    });

    this.messageBus.on(HandFSM.GAME_STATE, evt => {
      console.debug('[CollectPage] - constructor - onHandFSM.GAME_STATE', evt);
      if (this.handFSM.context && evt) {
        //   this.handFSM.context.state = evt.state;
        this.saveState();
      }
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
      this.displayedStats = this.stats.slice();
      this.displayedStats.reverse();
    });

    this.messageBus.on(StatCollector.UPLOAD_STAT, evt => {
      console.debug('[CollectPage] - constructor - onStatCollector.UPLOAD_STAT', evt);
      this.uploadStats();
    });
  }

  /**
   * @param  {string} playerId
   * @param  {string} defClass
   */
  getColor(playerId: string, defClass: string) {
    if (this.fsmContext && this.fsmContext.selectedPlayer && playerId === this.fsmContext.selectedPlayer.playerId) {
      return 'green';
    } else if (this.hasYellowCard(playerId)) {
      return 'yellow';
    } else if (defClass) {
      return defClass;
    }
  }

  /**
   *
   */
  saveSats(): void {
    console.debug('[CollectPage] - saveSats', this.stats);
    this.storage.set('stats-' + this.currentEvent._id, this.stats);
    this.saveState();
  }

  /**
   *
   */
  saveState(): void {
    console.debug('[CollectPage] - saveState', this.fsmContext);
    this.gameState.lastInMap = this.fsmContext.lastInMap;
    this.gameState.playTimeMap = this.fsmContext.playTimeMap;
    this.gameState.chrono = this.fsmContext.chrono;
    this.gameState.playerList = this.playerList;
    if (this.handFSM.context) {
      this.gameState.state = this.handFSM.context.state;
    }
    this.gameState.positions = this.playerPositions;
    this.storage.set('gameState-' + this.currentEvent._id, this.gameState);
    console.debug('[CollectPage] - saveState', this.gameState)
  }

  /**
   *
   */
  getStatisticsConfigAPI() {
    this.storage.get('listIndicators').then(list => {
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
    this.mapIndicators = Utils.groupBy(listIndicators, 'indicatorType');
    console.debug('[CollectPage] - updateListIndicators - mapIndicators', this.mapIndicators);
    this.indicatorsByCode = Utils.groupBy(listIndicators, 'code');
    console.debug('[CollectPage] - updateListIndicators - indicatorsByCode', this.indicatorsByCode);
    this.gameSystem = this.indicatorsByCode.defenseSystemThem[0].listValues;
    console.debug('[CollectPage] - updateListIndicators - gameSystem', this.gameSystem);
    this.possibleActions = {
      attack: {
        positive: Utils.filter(
          this.mapIndicators['PERS-ACT-OFF-POS'],
          'code',
          ['passOk', 'goalScored', 'impactShootDef', 'stopGKAtt', 'originShootDef', 'originShootAtt', 'impactShootAtt']
        ),
        negative: Utils.filter(
          this.mapIndicators['PERS-ACT-OFF-NEG'],
          'code',
          ['shootAtt', 'impactShootDef', 'originShootDef', 'originShootAtt', 'impactShootAtt']
        )
      },
      defense: {
        positive: Utils.filter(
          this.mapIndicators['PERS-ACT-DEF-POS'],
          'code',
          ['stopOk', 'originShootDef', 'stopGKDef', 'originShootAtt', 'impactShootDef', 'impactShootAtt']
        ),
        negative: Utils.filter(
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
      content: this.translations.loader
    });
    loader.present();
    this.playerMap = {};

    this.storage.get('gameState-' + this.currentEvent._id).then((gameState: GameState) => {
      console.debug('[CollectPage] - restoreState - gameState from storage', gameState);
      if (gameState) {
        this.gameState = gameState;
        this.fsmContext.lastInMap = this.gameState.lastInMap || {};
        this.fsmContext.playTimeMap = this.gameState.playTimeMap || {};
        this.fsmContext.chrono = this.gameState.chrono;
        this.handFSM.initialState = FSMStates.PAUSED;
        this.playerList = this.gameState.playerList || [];
        this.playerList.forEach(k => {
          console.debug('[CollectPage] - restoreState - gameState from storage - playerList', k);
          this.playerMap[k.playerId] = k;
        });
        for (let i = 0; i < this.gameState.homeTimeout; i++) {
          this.timeoutUsState[i] = true;
        }
        for (let i = 0; i < this.gameState.visitorTimeout; i++) {
          this.timeoutThemState[i] = true;
        }
        this.playerPositions = this.gameState.positions;
        this.ground = _.cloneDeep(this.ground);
        console.debug('[CollectPage] - restoreState - sanctions', this.playerMap);
        this.gameState.sanctions.forEach(s => {
          if (this.playerMap[s.playerId] && this.playerMap[s.playerId].holder) {
            this.playerMap[s.playerId].sanction = s.sanction;
          }
        });
        this.checkSanctions();
        this.storage.get('stats-' + this.currentEvent._id).then((stats: CollectStat[]) => {
          console.debug('[CollectPage] - restoreState - fetch stats', stats);
          this.setStats(stats || []);

          this.handFSM.start(this.fsmContext, FSMStates.PAUSED);
          this.handFSM.saveState(this.fsmContext);
          loader.dismiss();
          console.debug('[CollectPage] - restoreState - fetch context', 'fsmContext', this.fsmContext, 'gameState', this.gameState);
        });
      } else {
        console.debug('[CollectPage] - restoreState - new collect', 'playerPositions', this.playerPositions, 'playerList', this.playerList);
        this.gameState = new GameState();
        this.gameState.eventId = this.currentEvent._id;
        this.gameState.homeGameSystem = this.gameSystem[0];
        this.gameState.visitorGameSystem = this.gameSystem[0];
        this.fillPlayers({}, true);
        this.handFSM.start(this.fsmContext, FSMStates.INIT);
        loader.dismiss();
        this.saveSats();
        console.debug('[CollectPage] - restoreState - new collect', 'fsmContext', this.fsmContext, 'gameState', this.gameState);
      }
    });
  }

  /**
   * @param  {any} playerPositions
   * @param  {boolean} newGame
   */
  fillPlayers(playerPositions: any, newGame: boolean) {
    let difference = newGame ? this.playerPositions : diff(this.playerPositions, playerPositions);
    console.debug('[CollectPage] - fillPlayers - difference', difference, this.playerPositions, playerPositions);
    Object.keys(difference).forEach(k => {
      if (k === 'substitutes') {
        if (difference[k] instanceof Object) {
          difference[k] = Array.prototype.slice.call(difference[k]);
        }
        this.playerPositions[k] = difference[k];
        console.debug('[CollectPage] - fillPlayers - position', k, this.playerPositions['substitutes']);
        this.playerPositions['substitutes'].forEach(p => {
          let inGamePlayer = new InGamePlayer();
          inGamePlayer.playerId = p._id;
          inGamePlayer.position = 'substitutes';
          inGamePlayer.holder = false;
          this.playerMap[inGamePlayer.playerId] = inGamePlayer;
          this.statCollector.substitute(this.fsmContext, p._id);
          this.playerList.push(inGamePlayer);
          let lastIn = this.fsmContext.lastInMap[p._id] || 0;
          let playTime = this.fsmContext.chrono - lastIn;
          let totalPlayTime = this.fsmContext.playTimeMap[p._id] || 0;
          this.fsmContext.playTimeMap[p._id] = totalPlayTime + playTime;
          this.statCollector.playTime(this.fsmContext, p._id, playTime);
        });
      } else {
        let inGamePlayer = new InGamePlayer();
        console.debug('[CollectPage] - fillPlayers - position', k);
        inGamePlayer.playerId = difference[k]._id;
        inGamePlayer.position = k;
        inGamePlayer.holder = true;
        this.playerMap[inGamePlayer.playerId] = inGamePlayer;
        this.playerPositions[k] = difference[k];
        this.statCollector.positionType(this.fsmContext, difference[k]._id, k);
        this.statCollector.holder(this.fsmContext, difference[k]._id, k);
        this.fsmContext.lastInMap[difference[k]._id] = this.fsmContext.chrono;
        this.playerList.push(inGamePlayer);
        console.debug('[CollectPage] - fillPlayers - playerMap', this.playerMap);
      }
    });
    this.saveState();
  }

  /**
   * @param  {CollectStat[]} stats
   */
  setStats(stats: CollectStat[]) {
    console.debug('[CollectPage] - setStats', stats);
    this.stats = stats;
    this.displayedStats = stats.slice();
    this.displayedStats.reverse();
  }

  /**
   *
   * @param {string} avatar
   * @returns {string}
   */
  getAvatar(avatar: string): string {
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

  /**
   *
   * @returns {string} Goal id
   */
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

  /**
   *
   * @param {any} data
   */
  showGoal(data: { ground: string, goal: string, scorred: boolean }) {
    console.debug('[CollectPage] - showGoal', data);
    if (data.goal.startsWith('outside')) {
      if (this.fsmContext.gamePhase && this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.outsideAtt)) {
        this.statCollector.outside(this.fsmContext, data.goal, this.fsmContext.selectedPlayer.playerId);

      } else if (this.fsmContext.gamePhase && !this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.outsideDef)) {
        this.statCollector.outside(this.fsmContext, data.goal, this.getGaolkeeperId());
      }
      this.fsmContext.shootSeqId = undefined;
    } else if (data.goal.endsWith('pole')) {
      if (this.fsmContext.gamePhase && this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.poleShotAtt)) {
        this.statCollector.pole(this.fsmContext, data.goal, this.fsmContext.selectedPlayer.playerId);

      } else if (this.fsmContext.gamePhase && !this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.poleShotDef)) {
        this.statCollector.pole(this.fsmContext, data.goal, this.getGaolkeeperId());
      }
      this.fsmContext.shootSeqId = undefined;
    } else {
      if (this.fsmContext.gamePhase && this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.goalShotAtt)) {
        this.statCollector.goalTarget(this.fsmContext, StatType.IMPACT_SHOOD_ATT, data.goal, this.fsmContext.selectedPlayer.playerId);
        this.showGoalBtns(data);
      } else if (this.fsmContext.gamePhase && !this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.goalShotDef)) {
        this.statCollector.goalTarget(this.fsmContext, StatType.IMPACT_SHOOD_DEF, data.goal, this.getGaolkeeperId());
        this.showGoalBtns(data);
      } else {
        this.handFSM.trigger(FSMEvents.restoreGoalState);
      }
    }
  }

  /**
   *
   */
  showGround() {
    console.debug('[CollectPage] - showGround');
    if (!this.fsmContext.gamePhase) {
      this.presentToast(this.translations.collect.select_game_phase_first);
    } else if (!this.fsmContext.selectedPlayer) {
      this.presentToast(this.translations.collect.select_player);
    } else {
      let goalModal = this.modalController.create(GoalModal, {});
      goalModal.onDidDismiss((data: { ground: string, goal: string, scorred: boolean }) => {
        console.debug('[CollectPage] - showGround', data);
        if (data) {
          if (data.ground.startsWith('outside')) {
            if (this.fsmContext.gamePhase && this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.outsideAtt)) {
              this.statCollector.outside(this.fsmContext, data.ground, this.fsmContext.selectedPlayer.playerId);
            } else if (this.fsmContext.gamePhase && !this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.outsideDef)) {
              this.statCollector.outside(this.fsmContext, data.ground, this.getGaolkeeperId());
              this.handFSM.trigger(FSMEvents.doAttack);
            }
            this.fsmContext.shootSeqId = undefined;
          } else {
            if (this.fsmContext.gamePhase && this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.groundAtt)) {
              this.statCollector.ground(this.fsmContext, StatType.ORIGIN_SHOOT_ATT, data.ground, this.fsmContext.selectedPlayer.playerId);
              this.showGoal(data);
            } else if (this.fsmContext.gamePhase && !this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.groundDef)) {
              this.statCollector.ground(this.fsmContext, StatType.ORIGIN_SHOOT_DEF, data.ground, this.getGaolkeeperId());
              this.showGoal(data);
            } else {
              this.handFSM.trigger(FSMEvents.restoreGoalState);
            }
          }
        }
      });
      goalModal.present();
    }
  }

  /**
   *
   * @param {any} data
   */
  showGoalBtns(data: { ground: string, goal: string, scorred: boolean }) {
    console.debug('[CollectPage] - showGoalBtns', data);
    if (data.scorred) {
      this.goalButton();
    } else {
      this.stopShootButton();
    }
  }

  /**
   *
   */
  stopShootButton() {
    console.debug('[CollectPage] - stopShootButton');
    let fsmEvent = this.fsmContext.gamePhase.attack ? FSMEvents.stopShootAtt : FSMEvents.stopShootDef;
    let fsmPhase = this.fsmContext.gamePhase.attack ? FSMEvents.doDefense : FSMEvents.doAttack;
    if (this.handFSM.trigger(fsmEvent)) {
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
    }
  }

  /**
   *
   */
  goalButton() {
    console.debug('[CollectPage] - goalButton');
    if (!this.fsmContext.gamePhase) {
      this.presentToast(this.translations.collect.select_game_phase_first);
    } else if (!this.fsmContext.selectedPlayer) {
      this.presentToast(this.translations.collect.select_player);
    } else {
      let fsmEvent = this.fsmContext.gamePhase.attack ? FSMEvents.goalScoredAtt : FSMEvents.goalScoredDef;
      let fsmPhase = this.fsmContext.gamePhase.attack ? FSMEvents.doDefense : FSMEvents.doAttack;
      let wasAttack = this.fsmContext.gamePhase.attack;
      if (wasAttack) {
        this.statCollector.goalScored(this.fsmContext, this.fsmContext.selectedPlayer.playerId);
        this.gameState.homeScore++;
        if (this.handFSM.trigger(fsmEvent)) {
          this.doDefense();
        }
      } else {
        this.statCollector.goalConceded(this.fsmContext, this.fsmContext.selectedPlayer.playerId);
        this.gameState.visitorScore++;
        if (this.handFSM.trigger(fsmEvent)) {
          this.doAttack();
        }
      }
      this.fsmContext.shootSeqId = undefined;
      if (this.handFSM.trigger(fsmPhase)) {
        this.saveState();
      }
    }
  }

  /**
   *
   */
  doSelectGoalKeeper() {
    console.debug('[CollectPage] - doSelectGoalKeeper');
    this.doSelectPlayer(this.getGaolkeeperId());
  }

  /**
   * @param  {string} playerId
   */
  doSelectPlayer(playerId: string) {
    console.debug('[CollectPage] - doSelectPlayer', playerId, this.fsmContext, this.playerMap[playerId]);
    if (!this.fsmContext.gamePhase) {
      this.presentToast(this.translations.collect.select_game_phase_first);
    } else if (this.handFSM.trigger(FSMEvents.selectPlayer)) {
      if (this.fsmContext.selectedPlayer && this.fsmContext.gamePhase.attack) {
        this.statCollector.makePass(this.fsmContext, this.fsmContext.selectedPlayer.playerId, playerId);
      }
      this.fsmContext.selectedPlayer = this.playerMap[playerId];
    }
  }

  /**
   *
   */
  resume() {
    console.debug('[CollectPage] - resume', this.fsmContext.gamePhase);
    if (!this.fsmContext.gamePhase && this.handFSM.trigger(FSMEvents.startChrono)) {
      console.debug('[CollectPage] - resume', this.fsmContext.gamePhase);
    } else if (this.fsmContext.gamePhase && this.fsmContext.gamePhase.attack && this.handFSM.trigger(FSMEvents.doAttack)) {
      this.doAttack();
    } else if (this.handFSM.trigger(FSMEvents.doDefense)) {
      this.doDefense();
    }
  }

  /**
   * @param  {number} event
   */
  playButton(event: number) {
    console.debug('[CollectPage] - playButton', event);
    if (this.handFSM.context.state === FSMStates.GAME_ENDED) {
      this.presentToast(this.translations.collect.ended_popup_title);
      return;
    } else if (this.handFSM.context.state === FSMStates.INIT) {
      this.startCollect();
      if (this.handFSM.trigger(FSMEvents.startChrono))
        console.debug('[CollectPage] - playButton - startCollect', event);
    } else {
      if (this.handFSM.trigger(FSMEvents.resume)) {
        this.resume();
      }
    }
    this.fsmContext.paused = false;
  }

  /**
   * @param  {number} event
   */
  pauseButton(event: number) {
    console.debug('[CollectPage] - pauseButton', event);
    if (this.handFSM.trigger(FSMEvents.doPause)) {
      this.fsmContext.paused = true;
    }
  }

  /**
   *
   */
  startCollect() {
    console.debug('[CollectPage] - startCollect');
    this.currentCollect.startDate = Date.now();
    this.currentCollect.status = 'inProgress';
    this.storage.get('collects').then((collects: any) => {
      (collects || {})[this.currentCollect._id] = this.currentCollect;
      this.storage.set('collects', collects);
    });
  }

  /**
   * @param  {any} event
   */
  attackButton(event: any) {
    console.debug('[CollectPage] - attackButton', event);
    if (this.handFSM.trigger(FSMEvents.doAttack)) {
      this.doAttack();
    }
  }

  /**
   *
   */
  doAttack() {
    console.debug('[CollectPage] - doAttack');
    this.fsmContext.phaseSeqId = Utils.generateGUID();
    this.fsmContext.gamePhase = new GamePhase();
    this.fsmContext.gamePhase.attack = true;
    this.fsmContext.gamePhase.code = StatType.TIME_ATTACK;
    this.fsmContext.gamePhase.startTime = this.fsmContext.chrono;
    this.attackEnabled = false;
    this.defenseEnabled = true;
    this.fsmContext.selectedPlayer = undefined;
    this.populateActions('attack');
  }
  /**
   * @param  {any} event
   */
  defenseButton(event: any) {
    console.debug('[CollectPage] - defenseButton', event);
    if (this.handFSM.trigger(FSMEvents.doDefense)) {
      this.doDefense();
    }
  }

  /**
   *
   */
  doDefense() {
    console.debug('[CollectPage] - doDefense');
    this.fsmContext.phaseSeqId = Utils.generateGUID();
    this.fsmContext.gamePhase = new GamePhase();
    this.fsmContext.gamePhase.attack = false;
    this.fsmContext.gamePhase.code = StatType.TIME_DEFENSE;
    this.fsmContext.gamePhase.startTime = this.fsmContext.chrono;
    this.attackEnabled = true;
    this.defenseEnabled = false;
    this.fsmContext.selectedPlayer = undefined;
    this.populateActions('defense');
  }

  /**
   * @param  {any} event
   */
  hurtButton(event: any) {
    console.debug('[CollectPage] - hurtButton', event);
    if (!this.fsmContext.gamePhase) {
      this.presentToast(this.translations.collect.select_game_phase_first);
    } else if (!this.fsmContext.selectedPlayer) {
      this.presentToast(this.translations.collect.select_player);
    } else {
      this.messageBus.broadcast(ChronoComponent.PAUSE, {});
      this.statCollector.wound(this.fsmContext, this.fsmContext.selectedPlayer.playerId);
    }
  }

  /**
   * @param  {any} event
   */
  orangeCardButton(event: any) {
    console.debug('[CollectPage] - orangeCardButton', event, this.fsmContext.selectedPlayer);
    let selectedPlayer = _.cloneDeep(this.fsmContext.selectedPlayer);
    if (selectedPlayer && this.playerMap[selectedPlayer.playerId].sanction !== StatType.ORANGE_CARD) {
      if (this.handFSM.trigger(FSMEvents.sanction)) {
        console.debug('[CollectPage] - orangeCardButton - after trigger', selectedPlayer);
        this.playerMap[selectedPlayer.playerId].sanction = StatType.ORANGE_CARD;
        this.statCollector.card(this.fsmContext, StatType.ORANGE_CARD, selectedPlayer.playerId);
        this.gameState.sanctions.push({
          playerId: selectedPlayer.playerId,
          sanction: StatType.ORANGE_CARD,
          time: this.fsmContext.chrono,
          position: selectedPlayer.position,
          done: false
        });
        let p = _.cloneDeep(this.playerPositions[selectedPlayer.position]);
        delete this.playerPositions[selectedPlayer.position];
        this.playerPositions.substitutes.push(p);
        this.saveState();
      }
    }
  }


  checkSanctions() {
    Observable.interval(1000).timeInterval().subscribe(() => {
      this.gameState.sanctions.forEach(s => {
        switch (s.sanction) {
          case StatType.ORANGE_CARD:
            if (this.fsmContext.chrono >= s.time + 2 * 60 * 1000) {
              this.gameState.sanctions = this.gameState.sanctions.filter(p => {
                return p.playerId !== s.playerId;
              });
              this.saveState();
            }
            break;
          case StatType.RED_CARD:
            if (this.fsmContext.chrono >= s.time + 2 * 60 * 1000) {
              this.gameState.sanctions.filter(p => {
                return p.playerId !== s.playerId;
              }).forEach(s => {
                s.done = true;
              });
              this.saveState();
            }
            break;
          default:
            break;
        }
      });
    });
  }

  /**
   * UploadStatEvent
   */
  onUploadStatEvent() {
    console.debug('[CollectPage] - onUploadStatEvent');
    this.saveState();
    this.uploadStats();
  }

  /**
   * @param  {any} event
   */
  yellowCardButton(event: any) {
    console.debug('[CollectPage] - yellowCardButton', event);
    let selectedPlayer = _.cloneDeep(this.fsmContext.selectedPlayer);
    console.debug('[CollectPage] - yellowCardButton', selectedPlayer, this.playerMap[selectedPlayer.playerId]);
    if (selectedPlayer && this.playerMap[selectedPlayer.playerId].sanction !== StatType.YELLOW_CARD) {
      if (this.handFSM.trigger(FSMEvents.sanction)) {
        console.debug('[CollectPage] - yellowCardButton', selectedPlayer);
        this.playerMap[selectedPlayer.playerId].sanction = StatType.YELLOW_CARD;
        this.statCollector.card(this.fsmContext, StatType.YELLOW_CARD, selectedPlayer.playerId);
        this.gameState.sanctions.push({
          playerId: selectedPlayer.playerId,
          sanction: StatType.YELLOW_CARD,
          time: this.fsmContext.chrono,
          position: selectedPlayer.position,
          done: false
        });
        this.saveState();
      }
    } else if (selectedPlayer) {
      this.redCardButton(event, selectedPlayer);
    }
  }

  /**
   * @param  {string} playerId
   */
  hasYellowCard(playerId: string): boolean {
    let found = _.findIndex(this.gameState.sanctions, o => {
      return o.playerId === playerId && o.sanction === StatType.YELLOW_CARD;
    }) > -1;
    return found;
  }


  /**
   * @param  {any} event
   */
  redCardButton(event: any, player: InGamePlayer) {
    console.debug('[CollectPage] - redCardButton', event, this.fsmContext.selectedPlayer);
    let selectedPlayer = player ? player : _.cloneDeep(this.fsmContext.selectedPlayer);
    if (selectedPlayer && this.playerMap[selectedPlayer.playerId].sanction !== StatType.RED_CARD) {
      if (this.handFSM.trigger(FSMEvents.sanction)) {
        console.debug('[CollectPage] - redCardButton', event, selectedPlayer);
        this.playerMap[selectedPlayer.playerId].sanction = StatType.RED_CARD;
        this.statCollector.card(this.fsmContext, StatType.RED_CARD, selectedPlayer.playerId);
        this.gameState.sanctions.push({
          playerId: selectedPlayer.playerId,
          sanction: StatType.RED_CARD,
          time: this.fsmContext.chrono,
          position: selectedPlayer.position,
          done: false
        });
        this.playerMap[selectedPlayer.playerId].holder = false;
        let lastIn = this.fsmContext.lastInMap[selectedPlayer.playerId] || 0;
        let totalPlayTime = this.fsmContext.playTimeMap[selectedPlayer.playerId] || 0;
        this.fsmContext.playTimeMap[selectedPlayer.playerId] = totalPlayTime + this.fsmContext.chrono - lastIn;
        this.statCollector.totalPlayTime(this.fsmContext, selectedPlayer.playerId);
        delete this.playerPositions[selectedPlayer.position];
        this.saveState();
      }
    }
  }


  /**
   * @param  {number} index
   * @param  {any} event
   */
  timeoutThem(index: number, event: any) {
    console.debug('[CollectPage] - timeoutThem', index, event);
    if (this.fsmContext.paused) {
      this.timeoutThemState[index] = false;
      event.checked = false;
    } else if (this.handFSM.trigger(FSMEvents.timeout)) {
      this.messageBus.broadcast(ChronoComponent.PAUSE, {});
      this.statCollector.deadTime(this.fsmContext, StatType.TIMEOUT_THEM, this.getTeamVisitor());
      this.gameState.visitorTimeout++;
      this.timeoutThemState[index] = true;
      this.saveSats();
    } else {
      this.timeoutThemState[index] = false;
      event.checked = false;
    }
  }

  /**
   * @param  {number} index
   * @param  {any} event
   */
  timeoutUs(index: number, event: any) {
    console.debug('[CollectPage] - timeoutUs', index, event, this.fsmContext.paused);
    if (this.fsmContext.paused) {
      this.timeoutUsState[index] = false;
      event.checked = false;

    } else if (this.handFSM.trigger(FSMEvents.timeout)) {
      this.messageBus.broadcast(ChronoComponent.PAUSE, {});
      this.statCollector.deadTime(this.fsmContext, StatType.TIMEOUT_US, this.getTeamHomeId());
      this.gameState.homeTimeout++;
      this.timeoutUsState[index] = true;
      this.saveSats();
    } else {
      this.timeoutUsState[index] = false;
      event.checked = false;
    }
  }

  /**
   * @param  {any} event
   */
  toggleSubstitutes(event: any) {
    console.debug('[CollectPage] - toggleSubstitutes', event);
    let substitutionModal = this.modalController.create(SubstitutionModal, {
      playerList: this.rawPlayerList,
      playerPositions: _.cloneDeep(this.playerPositions),
      sanctions: this.gameState.sanctions
    });
    substitutionModal.onDidDismiss((data: { playerPositions: any }) => {
      if (data) {
        console.debug('[CollectPage] - toggleSubstitutes', data.playerPositions);
        this.fillPlayers(data.playerPositions, false);
      }
    });
    substitutionModal.present();
  }

  /**
   * @param  {any} event
   */
  onBackPressed(event: any) {
    console.debug('[CollectPage] - onBackPressed', event);
    // TODO
  }

  /**
   * @param  {any} event
   */
  positiveActionButton(event: any) {
    console.debug('[CollectPage] - positiveActionButton', event);
    if (!this.fsmContext.gamePhase) {
      this.presentToast(this.translations.collect.select_game_phase_first);
    } else if (!this.fsmContext.selectedPlayer) {
      this.presentToast(this.translations.collect.select_player);
    } else {
      let buttons = [];
      this.positiveActions.forEach(a => {
        buttons.push({
          text: this.translations.collect.indicators[a.code],
          handler: () => {
            this.statCollector.makeAction(this.fsmContext, a.code, this.fsmContext.selectedPlayer.playerId);
            if (!this.fsmContext.gamePhase.attack && !'neutralization' === a.code && this.handFSM.trigger(FSMEvents.doAttack)) {
              console.debug('[CollectPage] - positiveActionButton - action ', a.code);
            }
          }
        });
      });
      buttons.push({
        text: this.translations.actionButton.Cancel,
        role: 'cancel'
      });
      let actionSheet = this.actionSheetCtrl.create({
        title: this.translations.collect.positive_actions,
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
      this.presentToast(this.translations.collect.select_game_phase_first);
    } else if (!this.fsmContext.selectedPlayer) {
      this.presentToast(this.translations.collect.select_player);
    } else {
      let buttons = [];
      this.negativeActions.forEach(a => {
        buttons.push({
          text: this.translations.collect.indicators[a.code],
          handler: () => {
            this.statCollector.makeAction(this.fsmContext, a.code, this.fsmContext.selectedPlayer.playerId);
            this.fsmContext.selectedPlayer = undefined;
            if (this.handFSM.trigger(FSMEvents.doDefense)) {
              console.debug('[CollectPage] - negativeActionButton - action', a.code);
            }
          }
        });
      });
      buttons.push({
        text: this.translations.actionButton.Cancel,
        role: 'cancel'
      });
      let actionSheet = this.actionSheetCtrl.create({
        title: this.translations.collect.negative_actions,
        buttons: buttons
      });
      actionSheet.present();
    }
  }

  /**
   * @param  {string} phase
   */
  populateActions(phase: string) {
    console.debug('[CollectPage] - populateActions', phase);
    this.positiveActions = this.possibleActions[phase].positive;
    this.negativeActions = this.possibleActions[phase].negative;
    // gérer le goal ???
    console.debug('[CollectPage] - populateActions', this.positiveActions, this.negativeActions);

  }

  /**
   * @param  {any} event
   */
  visitorGameSystem(event: any) {
    this.statCollector.gameSystemChange(this.fsmContext, StatType.GAME_SYSTEM, this.gameState.visitorGameSystem, this.getTeamVisitor());
    this.saveState();
  }

  /**
   * @param  {any} event
   */
  homeGameSystem(event: any) {
    this.statCollector.gameSystemChange(this.fsmContext, StatType.GAME_SYSTEM, this.gameState.visitorGameSystem, this.getTeamHomeId());
    this.saveState();
  }

  /**
   * @param  {any} event
   */
  endPeriod(event: any) {
    console.debug('[CollectPage] - endPeriod', event);
    this.fsmContext.paused = true;
    this.gameState.state = this.handFSM.context.state;
    this.saveState();
    // bus.post(gameState); ?
  }

  /**
   *
   */
  endCollect() {
    console.debug('[CollectPage] - endCollect');
    this.fsmContext.paused = false;
    this.gameState.state = this.handFSM.context.state;
    this.saveState();
    this.presentToast(this.translations.collect.ended_popup_title);
  }

  /**
   * @param  {any} event
   */
  statsButton(event: any) {
    console.debug('[CollectPage] - statsButton', event);
    if (this.fsmContext.paused || this.handFSM.trigger(FSMEvents.doPause)) {
      let statsModal = this.modalController.create(StatsModal, {
        playerList: this.rawPlayerList,
        event: this.currentEvent,
        collect: this.currentCollect,
        stats: this.stats,
        gameState: this.gameState
      });
      statsModal.present();
    }
  }

  /**
   * @param  {any} event
   */
  stopButton(event: any) {
    console.debug('[CollectPage] - stopButton', event);
    let alert = this.alertCtrl.create({
      title: this.translations.warning,
      message: this.translations.collect.ended_prompt,
      buttons: [
        {
          text: this.translations.actionButton.Cancel,
          role: 'cancel'
        },
        {
          text: this.translations.actionButton.Ok,
          handler: () => {
            if(this.handFSM.trigger(FSMEvents.endChrono)) {
              this.currentCollect.endDate = moment.utc().valueOf();
              this.currentCollect.status = 'done';
              this.storage.get('collects').then((collects: any[]) => {
                if (!collects) {
                  collects = [];
                }
                collects.push(this.currentCollect);
                this.storage.set('collects', collects);
                this.saveSats();
                this.saveState();
                this.statCollector.endCollect(this.fsmContext);
              });
            }
          }
        }
      ]
    });
    alert.present();
  }

  /**
   *
   */
  uploadStats() {
    console.debug('[CollectPage] - uploadStats');
    this.collectService.updateCollect(this.currentCollect).subscribe(res => {
      console.debug('[CollectPage] - uploadStats - updateCollect', res);
      this.statAPI.addBulk(this.stats).subscribe(res => {
        console.debug('[CollectPage] - uploadStats - addBulk', res);
        this.presentToast(this.translations.collect.upload_done);
        this.navCtrl.setRoot(HomePage, {user: this.authenticationService.user});
      });
    });
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
    toast.present();
  }
}