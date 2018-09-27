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

import { StatType } from './stat.type';
import { InGamePlayer } from './ingame.player';

export class GameState {
    eventId: string = '';
    positions: any = {};
    chrono: number = 0;
    currentPhase: number = 1;
    playerList: Array<InGamePlayer> = [];
    homeScore: number = 0;
    visitorScore: number = 0;
    homeTimeout: number = 0;
    visitorTimeout: number = 0;
    sanctions: { playerId: string, sanction: StatType, time: number, position: string, done: boolean }[] = [];
    state: string = 'INIT';
    homeGameSystem: string = '';
    visitorGameSystem: string = '';
    playTimeMap: any = {};
    lastInMap: any = {};
}