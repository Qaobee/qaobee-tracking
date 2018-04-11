import { FSMStates } from './../../model/fsm/fsm.states';
import { FSMEvents } from './../../model/fsm/fsm.events';
import { FSMContext } from './../../model/fsm/fsm.context';
import { GamePhase } from './../../model/game.phase';
import { StatCollector } from './stat.collector';
import { StatType } from './../../model/stat.type';
import { MessageBus } from './../message-bus.service';
import { Injectable } from "@angular/core";
import { EasyFlow, from, on, to, finish, whenEnter, Context } from 'node-easy-flow';


@Injectable()
export class HandFSM extends EasyFlow {
    static SWITCH_PHASE = 'stat-switch-phase';
    static GAME_STATE = 'stat-game-state';
    static ROLLBACK = 'stat-rollback';

    context: Context;
    /**
     * @param  {MessageBus} privatemessageBus
     * @param  {StatCollector} statCollector
     */
    constructor(private messageBus: MessageBus, private statCollector: StatCollector) {
        super();

        // transition definitions
        from(FSMStates.INIT,
            on(FSMEvents.endChrono, finish(FSMStates.GAME_ENDED)),
            on(FSMEvents.startChrono,
                to(FSMStates.GAME_STARTED,
                    on(FSMEvents.endChrono, finish(FSMStates.GAME_ENDED)),
                    on(FSMEvents.doPause,
                        to(FSMStates.PAUSED,
                            on(FSMEvents.endChrono, finish(FSMStates.GAME_ENDED)),
                            on(FSMEvents.stopTimer, to(FSMStates.INIT)),
                            on(FSMEvents.resume, to(FSMStates.GAME_STARTED))
                        )
                    ),
                    on(FSMEvents.doAttack,
                        to(FSMStates.ATTACK,
                            on(FSMEvents.endChrono, finish(FSMStates.GAME_ENDED)),
                            on(FSMEvents.timeout, to(FSMStates.PAUSED)),
                            on(FSMEvents.doPause, to(FSMStates.PAUSED)),
                            on(FSMEvents.doDefense, to(FSMStates.DEFENSE)),
                            on(FSMEvents.selectPlayer,
                                to(FSMStates.SELECTED_PLAYER,
                                    on(FSMEvents.endChrono, finish(FSMStates.GAME_ENDED)),
                                    on(FSMEvents.doPause, to(FSMStates.PAUSED)),
                                    on(FSMEvents.timeout, to(FSMStates.PAUSED)),
                                    on(FSMEvents.outsideAtt, to(FSMStates.DEFENSE)),
                                    on(FSMEvents.sanction, to(FSMStates.DEFENSE)),
                                    on(FSMEvents.doDefense, to(FSMStates.DEFENSE)),
                                    on(FSMEvents.doAttack, to(FSMStates.ATTACK)),
                                    on(FSMEvents.groundDef, to(FSMStates.GROUND_SELECTED)),
                                    on(FSMEvents.selectPlayer,
                                        to(FSMStates.RETURN_TO_SELECTED_PLAYER,
                                            on(FSMEvents.endChrono, finish(FSMStates.GAME_ENDED)),
                                            on(FSMEvents.goToSelectPlayer, to(FSMStates.SELECTED_PLAYER))
                                        )
                                    ),
                                    on(FSMEvents.wound, to(FSMStates.RETURN_TO_SELECTED_PLAYER)),
                                    on(FSMEvents.groundAtt,
                                        to(FSMStates.GROUND_SELECTED,
                                            on(FSMEvents.restoreGroundState, to(FSMStates.SELECTED_PLAYER)),
                                            on(FSMEvents.leaveGround,
                                                to(FSMStates.GROUND_LEAVED,
                                                    on(FSMEvents.backDone, to(FSMStates.RETURN_TO_SELECTED_PLAYER))
                                                )
                                            ),
                                            on(FSMEvents.endChrono, finish(FSMStates.GAME_ENDED)),
                                            on(FSMEvents.doPause, to(FSMStates.PAUSED)),
                                            on(FSMEvents.timeout, to(FSMStates.PAUSED)),
                                            on(FSMEvents.doAttack, to(FSMStates.ATTACK)),
                                            on(FSMEvents.outsideAtt, to(FSMStates.DEFENSE)),
                                            on(FSMEvents.outsideDef, to(FSMStates.ATTACK)),
                                            on(FSMEvents.doDefense, to(FSMStates.DEFENSE)),
                                            on(FSMEvents.poleShotAtt, to(FSMStates.SELECTED_PLAYER)),
                                            on(FSMEvents.poleShotDef, to(FSMStates.SELECTED_PLAYER)),
                                            on(FSMEvents.goalShotAtt,
                                                to(FSMStates.GOAL_SELECTED,
                                                    on(FSMEvents.endChrono, finish(FSMStates.GAME_ENDED)),
                                                    on(FSMEvents.restoreGoalState, to(FSMStates.GROUND_SELECTED)),
                                                    on(FSMEvents.leaveGoal,
                                                        to(FSMStates.GOAL_LEAVED,
                                                            on(FSMEvents.leaveGround, to(FSMStates.GROUND_LEAVED))
                                                        )
                                                    ),
                                                    on(FSMEvents.restoreGroundState, to(FSMStates.SELECTED_PLAYER)),
                                                    on(FSMEvents.timeout, to(FSMStates.PAUSED)),
                                                    on(FSMEvents.doPause, to(FSMStates.PAUSED)),
                                                    on(FSMEvents.doDefense, to(FSMStates.DEFENSE)),
                                                    on(FSMEvents.stopShootAtt, to(FSMStates.DEFENSE)),
                                                    on(FSMEvents.goalScoredAtt, to(FSMStates.DEFENSE)),
                                                    on(FSMEvents.cornerShotAtt, to(FSMStates.DEFENSE)),
                                                    on(FSMEvents.doAttack, to(FSMStates.ATTACK)),
                                                    on(FSMEvents.goalScoredDef, to(FSMStates.ATTACK)),
                                                    on(FSMEvents.stopShootDef, to(FSMStates.ATTACK)),
                                                    on(FSMEvents.cornerShotDef, to(FSMStates.ATTACK))
                                                )
                                            ),
                                            on(FSMEvents.goalShotDef, to(FSMStates.GOAL_SELECTED))
                                        )
                                    )
                                )
                            ),
                            on(FSMEvents.doDefense,
                                to(FSMStates.DEFENSE,
                                    on(FSMEvents.endChrono, finish(FSMStates.GAME_ENDED)),
                                    on(FSMEvents.timeout, to(FSMStates.PAUSED)),
                                    on(FSMEvents.doPause, to(FSMStates.PAUSED)),
                                    on(FSMEvents.doAttack, to(FSMStates.ATTACK)),
                                    on(FSMEvents.outsideDef, to(FSMStates.ATTACK)),
                                    on(FSMEvents.groundDef, to(FSMStates.GROUND_SELECTED)),
                                    on(FSMEvents.selectPlayer, to(FSMStates.SELECTED_PLAYER))
                                )
                            )
                        )
                    )
                )
            )
        );

        whenEnter(FSMStates.INIT, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(FSMStates.GOAL_LEAVED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.messageBus.broadcast(HandFSM.ROLLBACK)
            this.saveState(context);
            this.trigger(FSMEvents.leaveGround);
        });

        whenEnter(FSMStates.GROUND_LEAVED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.messageBus.broadcast(HandFSM.ROLLBACK)
            this.saveState(context);
            this.trigger(FSMEvents.backDone);
        });

        whenEnter(FSMStates.PAUSED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(FSMStates.GROUND_SELECTED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(FSMStates.GOAL_SELECTED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(FSMStates.SELECTED_PLAYER, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(FSMStates.GAME_ENDED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(FSMStates.GAME_STARTED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            context.fsmContext.gameStarted = true;
            this.saveState(context);
        });

        whenEnter(FSMStates.ATTACK, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            if (context.fsmContext.gamePhase) {
                this.statCollector.switchPhase(context.fsmContext, context.fsmContext.chrono - context.fsmContext.gamePhase.startTime);
            }
            let phase = new GamePhase();
            phase.attack = true;
            phase.code = StatType.TIME_ATTACK;
            phase.startTime = context.fsmContext.chrono;
            context.fsmContext.gamePhase = phase;
            this.saveState(context);
            this.messageBus.broadcast(HandFSM.SWITCH_PHASE, { attack: true });
        });

        whenEnter(FSMStates.DEFENSE, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            if (context.fsmContext.gamePhase) {
                this.statCollector.switchPhase(context.fsmContext, context.fsmContext.chrono - context.fsmContext.gamePhase.startTime);
            }
            let phase = new GamePhase();
            phase.attack = false;
            phase.code = StatType.TIME_DEFENSE;
            phase.startTime = context.fsmContext.chrono;
            context.fsmContext.gamePhase = phase;
            this.saveState(context);
            this.messageBus.broadcast(HandFSM.SWITCH_PHASE, { attack: false });
        });

        whenEnter(FSMStates.RETURN_TO_SELECTED_PLAYER, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.trigger(FSMEvents.goToSelectPlayer);
            this.saveState(context);
        });

    }

    /**
     * @param  {Context} context
     */
    saveState(context: Context) {
        this.messageBus.broadcast(HandFSM.GAME_STATE, { state: context.state });
    }

    /**
     * @param  {FSMContext} fsmContext
     * @returns {Context}
     */
    start(fsmContext: FSMContext): Context {
        this.context = super.start({ fsmContext: fsmContext });
        return this.context;
    }
    /**
     * @param  {FSMEvents} event
     */
    trigger(event: FSMEvents) {
        return super.trigger(event, this.context);
    }
}