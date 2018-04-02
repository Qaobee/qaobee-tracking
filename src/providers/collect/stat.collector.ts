import {Injectable} from "@angular/core";
import {FSMContext} from "../../model/fsm.context";
import {CollectStat} from "../../model/collect.stat";
import {StatType} from "../../model/stat.type";
import {MessageBus} from "../message-bus.service";
import {InGamePlayer} from "../../model/ingame.player";

@Injectable
export class StatCollector {
    public STAT = 'collect.stat';
    constructor (
        private messageBus: MessageBus) {

    }

    /**
     * Build a collectEvent
     * @param {FSMContext} context
     * @param {string} code
     * @param {string | number} value
     * @returns {CollectStat}
     */
    eventBuilder(context: FSMContext, code: string, value: string | number): CollectStat {
        let evt: CollectStat = new CollectStat();
        evt.activityId = context.meta.activity._id;
        evt.eventId = context.eventId;
        evt.chrono = context.chrono;
        evt.phaseSeqId = context.phaseSeqId;
        evt.code = code;
        evt.owners = context.owners;
        evt.producter = context.connectedUser._id;
        evt.timer = new Date().valueOf();
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
        if(playerId) {
            stat.owners.push(playerId);
        }
        this.messageBus.broadcast(this.STAT, stat);
    }

    endCollect(context: FSMContext) {
        if (context.gamePhase) {
            this.switchPhase(context, context.chrono - context.gamePhase.startTime);
        }

        context.players.forEach(rp =>  {
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
                context.playTimeMap[rp.playerId] =  totalPlayTime + playTime;
            }
            this.totalPlayTime(context, rp.playerId);
        });
        // TODO
        this.messageBus.broadcast('upload.stats');
    }

    switchPhase(context: FSMContext, duration: number) {
        // TODO
    }

    playTime(context: FSMContext, playerId: string, playTime: number) {
        // TODO
    }

    totalPlayTime(context: FSMContext, playerId: string) {
        // TODO
    }
}