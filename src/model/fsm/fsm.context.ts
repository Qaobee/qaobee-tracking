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