import { GamePhase } from './../../model/game.phase';
import { StatCollector } from './stat.collector';
import { StatType } from './../../model/stat.type';
import { MessageBus } from './../message-bus.service';
import { Injectable } from "@angular/core";
import { EasyFlow, from, on, to, finish, whenEnter, Context } from 'node-easy-flow';

@Injectable()
export class HandFSM extends EasyFlow {

    /**
     * @param  {MessageBus} privatemessageBus
     * @param  {StatCollector} statCollector
     */
    constructor(private messageBus: MessageBus, private statCollector: StatCollector) {
        super();
        // states
        const
            PAUSED = 'PAUSED',
            INIT = 'INIT',
            GROUND_SELECTED = 'GROUND_SELECTED',
            GOAL_SELECTED = 'GOAL_SELECTED',
            SELECTED_PLAYER = 'SELECTED_PLAYER',
            DEFENSE = 'DEFENSE',
            GAME_STARTED = 'GAME_STARTED',
            ATTACK = 'ATTACK',
            RETURN_TO_SELECTED_PLAYER = 'RETURN_TO_SELECTED_PLAYER',
            GOAL_LEAVED = 'GOAL_LEAVED',
            GROUND_LEAVED = 'GROUND_LEAVED',
            GAME_ENDED = 'GAME_ENDED';

        // events
        const
            startChrono = 'startChrono',
            doPause = 'doPause',
            doAttack = 'doAttack',
            doDefense = 'doDefense',
            selectPlayer = 'selectPlayer',
            groundAtt = 'groundAtt',
            groundDef = 'groundDef',
            goalShotAtt = 'goalShotAtt',
            goalShotDef = 'goalShotDef',
            poleShotAtt = 'poleShotAtt',
            poleShotDef = 'poleShotDef',
            cornerShotAtt = 'cornerShotAtt',
            cornerShotDef = 'cornerShotDef',
            stopShootAtt = 'stopShootAtt',
            stopShootDef = 'stopShootDef',
            goalScoredAtt = 'goalScoredAtt',
            goalScoredDef = 'goalScoredDef',
            outsideAtt = 'outsideAtt',
            outsideDef = 'outsideDef',
            timeout = 'timeout',
            stopTimer = 'stopTimer',
            sanction = 'sanction',
            wound = 'wound',
            goToSelectPlayer = 'goToSelectPlayer',
            resume = 'resume',
            restoreGroundState = 'restoreGroundState',
            restoreGoalState = 'restoreGoalState',
            leaveGoal = 'leaveGoal',
            leaveGround = 'leaveGround',
            backDone = 'backDone',
            endChrono = 'endChrono';

        // transition definitions
        from(INIT,
            on(endChrono, finish(GAME_ENDED)),
            on(startChrono,
                to(GAME_STARTED,
                    on(endChrono, finish(GAME_ENDED)),
                    on(doPause,
                        to(PAUSED,
                            on(endChrono, finish(GAME_ENDED)),
                            on(stopTimer, to(INIT)),
                            on(resume, to(GAME_STARTED))
                        )
                    ),
                    on(doAttack,
                        to(ATTACK,
                            on(endChrono, finish(GAME_ENDED)),
                            on(timeout, to(PAUSED)),
                            on(doPause, to(PAUSED)),
                            on(doDefense, to(DEFENSE)),
                            on(selectPlayer,
                                to(SELECTED_PLAYER,
                                    on(endChrono, finish(GAME_ENDED)),
                                    on(doPause, to(PAUSED)),
                                    on(timeout, to(PAUSED)),
                                    on(outsideAtt, to(DEFENSE)),
                                    on(sanction, to(DEFENSE)),
                                    on(doDefense, to(DEFENSE)),
                                    on(doAttack, to(ATTACK)),
                                    on(groundDef, to(GROUND_SELECTED)),
                                    on(selectPlayer,
                                        to(RETURN_TO_SELECTED_PLAYER,
                                            on(endChrono, finish(GAME_ENDED)),
                                            on(goToSelectPlayer, to(SELECTED_PLAYER))
                                        )
                                    ),
                                    on(wound, to(RETURN_TO_SELECTED_PLAYER)),
                                    on(groundAtt,
                                        to(GROUND_SELECTED,
                                            on(restoreGroundState, to(SELECTED_PLAYER)),
                                            on(leaveGround,
                                                to(GROUND_LEAVED,
                                                    on(backDone, to(RETURN_TO_SELECTED_PLAYER))
                                                )
                                            ),
                                            on(endChrono, finish(GAME_ENDED)),
                                            on(doPause, to(PAUSED)),
                                            on(timeout, to(PAUSED)),
                                            on(doAttack, to(ATTACK)),
                                            on(outsideAtt, to(DEFENSE)),
                                            on(outsideDef, to(ATTACK)),
                                            on(doDefense, to(DEFENSE)),
                                            on(poleShotAtt, to(SELECTED_PLAYER)),
                                            on(poleShotDef, to(SELECTED_PLAYER)),
                                            on(goalShotAtt,
                                                to(GOAL_SELECTED,
                                                    on(endChrono, finish(GAME_ENDED)),
                                                    on(restoreGoalState, to(GROUND_SELECTED)),
                                                    on(leaveGoal,
                                                        to(GOAL_LEAVED,
                                                            on(leaveGround, to(GROUND_LEAVED))
                                                        )
                                                    ),
                                                    on(restoreGroundState, to(SELECTED_PLAYER)),
                                                    on(timeout, to(PAUSED)),
                                                    on(doPause, to(PAUSED)),
                                                    on(doDefense, to(DEFENSE)),
                                                    on(stopShootAtt, to(DEFENSE)),
                                                    on(goalScoredAtt, to(DEFENSE)),
                                                    on(cornerShotAtt, to(DEFENSE)),
                                                    on(doAttack, to(ATTACK)),
                                                    on(goalScoredDef, to(ATTACK)),
                                                    on(stopShootDef, to(ATTACK)),
                                                    on(cornerShotDef, to(ATTACK))
                                                )
                                            ),
                                            on(goalShotDef, to(GOAL_SELECTED))
                                        )
                                    )
                                )
                            ),
                            on(doDefense,
                                to(DEFENSE,
                                    on(endChrono, finish(GAME_ENDED)),
                                    on(timeout, to(PAUSED)),
                                    on(doPause, to(PAUSED)),
                                    on(doAttack, to(ATTACK)),
                                    on(outsideDef, to(ATTACK)),
                                    on(groundDef, to(GROUND_SELECTED)),
                                    on(selectPlayer, to(SELECTED_PLAYER))
                                )
                            )
                        )
                    )
                )
            )
        );

        whenEnter(INIT, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(GOAL_LEAVED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            // TODO
            this.messageBus.broadcast('stat-rollback')
            this.saveState(context);
            context.safeTrigger(leaveGround);
        });

        whenEnter(GROUND_LEAVED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            // TODO
            this.messageBus.broadcast('stat-rollback')
            this.saveState(context);
            context.safeTrigger(backDone);
        });

        whenEnter(PAUSED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(GROUND_SELECTED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(GOAL_SELECTED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(SELECTED_PLAYER, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(GAME_ENDED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            this.saveState(context);
        });

        whenEnter(GAME_STARTED, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            context.fsmContext.gameStarted = true;
            this.saveState(context);
        });

        whenEnter(ATTACK, (context: Context) => {
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
            // TODO
            this.messageBus.broadcast('stat-switch-phase', { status: true });
        });

        whenEnter(DEFENSE, (context: Context) => {
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
            // TODO
            this.messageBus.broadcast('stat-switch-phase', { status: false });
        });

        whenEnter(RETURN_TO_SELECTED_PLAYER, (context: Context) => {
            console.debug('[HandFSM] whenEnter', context.state);
            context.safeTrigger(goToSelectPlayer);
            this.saveState(context);
        });

    }
    
    /**
     * @param  {Context} context
     */
    saveState(context: Context) {
        // TODO
        this.messageBus.broadcast('stat-game-state', { state: context.state });
    }
}