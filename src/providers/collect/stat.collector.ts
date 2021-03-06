/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.
 *  Qaobee
 *  All Rights Reserved.
 *
 *  NOTICE: All information contained here is, and remains
 *  the property of Qaobee and its suppliers,
 *  if any. The intellectual and technical concepts contained
 *  here are proprietary to Qaobee and its suppliers and may
 *  be covered by U.S. and Foreign Patents, patents in process,
 *  and are protected by trade secret or copyright law.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from Qaobee.
 */

import { FSMContext } from '../../model/fsm/fsm.context';
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
     *
     * @param {MessageBus} messageBus
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
    eventBuilder(context: FSMContext, code: StatType | string, value: string | number): CollectStat {
        let evt: CollectStat = new CollectStat();
        evt.activityId = context.meta.activity._id;
        evt.eventId = context.eventId;
        evt.chrono = context.chrono;
        evt.phaseSeqId = context.phaseSeqId;
        evt.code = code;
        evt.owner = context.owners;
        evt.producter = [ context.connectedUser._id ];
        evt.timer = moment.utc().valueOf();
        if (context.shootSeqId) {
            evt.shootSeqId = context.shootSeqId;
        }
        if (context.gamePhase) {
            evt.attack = context.gamePhase.attack;
        }
        console.debug('[StatCollector] - eventBuilder - code : ', code, value);
        if (typeof value === 'string') {
            evt.value = value;
        } else {
            evt.intValue = value;
        }

        console.debug('[StatCollector] - eventBuilder - evt : ', evt);
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
            stat.owner.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     *
     * @param {FSMContext} context
     */
    endCollect(context: FSMContext) {
        console.debug('[StatCollector] - endCollect - context.players', context.players);
        if (context.gamePhase) {
            this.switchPhase(context, context.chrono - context.gamePhase.startTime);
        }

        context.players.forEach(rp => {
            console.debug('[StatCollector] - endCollect', rp);
            if (rp.holder) {
                let lastIn = 0;
                if (context.lastInMap.hasOwnProperty(rp.playerId)) {
                    lastIn = context.lastInMap[ rp.playerId ];
                }
                let playTime = context.chrono - lastIn;
                this.playTime(context, rp.playerId, playTime);
                let totalPlayTime = 0;
                if (context.playTimeMap.hasOwnProperty(rp.playerId)) {
                    totalPlayTime = context.playTimeMap[ rp.playerId ];
                }
                context.playTimeMap[ rp.playerId ] = totalPlayTime + playTime;
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
            stat.owner.push(playerId);
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
            stat.owner.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    totalPlayTime(context: FSMContext, playerId: string) {
        let stat = this.eventBuilder(context, StatType.TOTAL_PLAY_TIME, context.playTimeMap[ playerId ]);
        if (playerId) {
            stat.owner.push(playerId);
        }
        console.debug('[StatCollector] - totalPlayTime', stat, 'context.playTimeMap[ playerId ]', context.playTimeMap[ playerId ]);
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
            stat.owner.push(team);
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
        console.debug('StatCollector - goalTarget - playerId =>' + playerId);
        let stat = this.eventBuilder(context, code, area);
        if (playerId) {
            stat.owner.push(playerId);
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
        console.debug('StatCollector - goalTarget - playerId =>' + playerId);
        let stat = this.eventBuilder(context, code, target);
        if (playerId) {
            stat.owner.push(playerId);
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
            stat.owner.push(playerId);
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
            stat.owner.push(playerId);
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
            stat.owner.push(team);
        }
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    goalScored(context: FSMContext, playerId: string) {
        let stat = this.eventBuilder(context, StatType.GOAL_SCORED, 1);
        if (playerId) {
            stat.owner.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    goalConceded(context: FSMContext, playerId: string) {
        console.debug('StatCollector - goalConceded - playerId =>' + playerId);
        let stat = this.eventBuilder(context, StatType.GOAL_CONCEDED, 1);
        if (playerId) {
            stat.owner.push(playerId);
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
            stat.owner.push(playerId);
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
            stat.owner.push(playerId);
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
            stat.owner.push(playerId);
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
            stat.owner.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }

    /**
     * @param  {FSMContext} context
     * @param  {string} playerId
     */
    substitute(context: FSMContext, playerId: string) {
        let lastIn = context.lastInMap[ playerId ] || 0;
        let stat = this.eventBuilder(context, StatType.SUBSTITUE, context.chrono - lastIn);
        if (playerId) {
            stat.owner.push(playerId);
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
            stat.owner.push(playerId);
        }
        this.messageBus.broadcast(StatCollector.STAT, stat);
    }
}