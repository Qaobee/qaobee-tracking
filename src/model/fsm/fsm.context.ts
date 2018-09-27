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

import { InGamePlayer } from '../ingame.player';
import { GamePhase } from '../game.phase';

/**
 * Class describing the FSM context
 */
export class FSMContext {
    /**
     * Is game paused
     * @type {boolean}
     */
    paused: boolean = true;
    /**
     * Is game started
     * @type {boolean}
     */
    gameStarted: boolean = false;
    /**
     * Currently selected player
     */
    selectedPlayer: InGamePlayer;
    /**
     * The current relative game play time
     * @type {number}
     */
    chrono: number = 0;
    /**
     * The current game phase
     */
    gamePhase: GamePhase;
    /**
     * The collected event id
     */
    eventId: string;
    /**
     * The players list
     */
    players: InGamePlayer[] = [];
    /**
     * Qaobee user's meta data
     */
    meta: any;
    /**
     * The connected user
     */
    connectedUser: any;
    /**
     * Owners list
     */
    owners: string[] = [];
    /**
     * Indicators map
     */
    indicators: any = {};
    /**
     * Playtime map
     */
    playTimeMap: any = {};
    /**
     * Player last in game time map
     */
    lastInMap: any = {};
    /**
     * Shoot sequence
     */
    shootSeqId: string;
    /**
     * Phase sequence
     */
    phaseSeqId: string;
}