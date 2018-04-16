import { FSMContext } from './../../model/fsm/fsm.context';
import { Injectable } from "@angular/core";
import { CollectStat } from "../../model/collect.stat";
import { StatType } from "../../model/stat.type";
import { MessageBus } from "../message-bus.service";
import moment from 'moment';

@Injectable()
export class StatCollector {
    static STAT = 'collect.stat';
    static UPLOAD_STAT = 'upload.stats';
    /**
     * @param  {MessageBus} privatemessageBus
     */
    constructor(
        private messageBus: MessageBus) {
    }

    /**
     * Build a collectEvent
     * @param {FSMContext} context
     * @param {StatType} code
     * @param {string | number} value
     * @returns {CollectStat}
     */
    eventBuilder(context: FSMContext, code: StatType|string, value: string | number): CollectStat {
        let evt: CollectStat = new CollectStat();
        evt.activityId = context.meta.activity._id;
        evt.eventId = context.eventId;
        evt.chrono = context.chrono;
        evt.phaseSeqId = context.phaseSeqId;
        evt.code = code;
        evt.owners = context.owners;
        evt.producter = context.connectedUser._id;
        evt.timer = moment.utc().valueOf();
        if (context.shootSeqId) {
            evt.shootSeqId = context.shootSeqId;
        }
        if (context.gamePhase) {
            evt.attack = context.gamePhase.attack;
        }
        if (typeof value === 'string') {
            evt.value = value;
        } else {
            evt.intValue = value;
        }
        return evt;
    }


    /**
     *
     * @param {FSMContext} context
     * @param {string} playerId
     * @param {string} otherPlayer
     */
    makePass(context: FSMContext, playerId: string, otherPlayer: string): void {
        let stat = this.eventBuilder(context, StatType.PASS, otherPlayer);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     *
     * @param {FSMContext} context
     */
    endCollect(context: FSMContext) {
        if (context.gamePhase) {
            this.switchPhase(context, context.chrono - context.gamePhase.startTime);
        }

        context.players.forEach(rp => {
            if (rp.holder) {
                let lastIn = 0;
                if (context.lastInMap.hasOwnProperty(rp.playerId)) {
                    lastIn = context.lastInMap[rp.playerId];
                }
                let playTime = context.chrono - lastIn;
                this.playTime(context, rp.playerId, playTime);
                let totalPlayTime = 0;
                if (context.playTimeMap.hasOwnProperty(rp.playerId)) {
                    totalPlayTime = context.playTimeMap[rp.playerId];
                }
                context.playTimeMap[rp.playerId] = totalPlayTime + playTime;
            }
            this.totalPlayTime(context, rp.playerId);
        });
        // TODO
        this.messageBus.broadcast(StatCollector.UPLOAD_STAT);
    }

    /**
     * 
     * @param {FSMContext} context 
     * @param {StatType} cardValue 
     * @param {string} playerId 
     */
    card(context: FSMContext, cardValue: StatType, playerId: string) {
        let stat = this.eventBuilder(context, cardValue, 1);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {number} duration
     */
    switchPhase(context: FSMContext, duration: number) {
        let stat = this.eventBuilder(context, context.gamePhase.code, duration);
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }
    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     * @param  {number} playTime
     */
    playTime(context: FSMContext, playerId: string, playTime: number) {
        let stat = this.eventBuilder(context, StatType.PLAY_TIME, playTime);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    totalPlayTime(context: FSMContext, playerId: string) {
        let stat = this.eventBuilder(context, StatType.TOTAL_PLAY_TIME, context.playTimeMap[playerId]);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {StatType} code
     * @param  {string} gameSystem
     * @param  {string} team
     */
    gameSystemChange(context: FSMContext, code: StatType, gameSystem: string, team: string) {
        let stat = this.eventBuilder(context, code, gameSystem);
        if (team != null) {
            stat.owners.push(team);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {StatType} code
     * @param  {string} area
     * @param  {string} playerId
     */
    ground(context: FSMContext, code: StatType, area: string, playerId: string) {
        let stat = this.eventBuilder(context, code, area);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {StatType} code
     * @param  {string} target
     * @param  {string} playerId
     */
    goalTarget(context: FSMContext, code: StatType, target: string, playerId: string) {
        let stat = this.eventBuilder(context, code, target);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} action
     * @param  {string} playerId
     */
    makeAction(context: FSMContext, action: string, playerId: string) {
        let stat = this.eventBuilder(context, action, 1);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} where
     * @param  {string} playerId
     */
    outside(context: FSMContext, where: string, playerId: string) {
        let stat = this.eventBuilder(context, StatType.OUTSIDE, where);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {StatType} code
     * @param  {string} team
     */
    deadTime(context: FSMContext, code: StatType, team: string) {
        let stat = this.eventBuilder(context, code, team);
        if (team != null) {
            stat.owners.push(team);
        }
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    goalScored(context: FSMContext, playerId: string) {
        let stat = this.eventBuilder(context, StatType.GOAL_SCORED, 1);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    goalConceded(context: FSMContext, playerId: string) {
        let stat = this.eventBuilder(context, StatType.GOAL_CONCEDED, 1);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    wound(context: FSMContext, playerId: string) {
        let stat = this.eventBuilder(context, StatType.WOUND, 1);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    stopShoot(context: FSMContext, playerId: string) {
        let code = context.gamePhase.attack ? StatType.stopGKAtt : StatType.stopGKDef;
        let stat = this.eventBuilder(context, code, 1);
        if (playerId) {
            stat.owners.push(playerId);
        }
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} pole
     * @param  {string} playerId
     */
    pole(context: FSMContext, pole: string, playerId: string) {
        let stat = this.eventBuilder(context, StatType.POLE, pole);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     * @param  {string} positionType
     */
    holder(context: FSMContext, playerId: string, positionType: string) {
        let stat = this.eventBuilder(context, StatType.HOLDER, positionType);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    substitute(context: FSMContext, playerId: string) {
        let lastIn = 0;
        if (context.lastInMap.hasOwnProperty(playerId)) {
            lastIn = context.lastInMap[playerId];
        }
        let stat = this.eventBuilder(context, StatType.SUBSTITUE, context.chrono - lastIn);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     * @param  {string} position
     */
    positionType(context: FSMContext, playerId: string, position: string) {
        let stat = this.eventBuilder(context, StatType.POSITION_TYPE, position);
        if (playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }
}