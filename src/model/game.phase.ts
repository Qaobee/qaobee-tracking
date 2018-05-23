import { StatType } from "./stat.type";

/**
 * Class describing a game phase
 */
export class GamePhase {
    /**
     * Is attack
     */
    attack: boolean;
    /**
     * Phase code
     */
    code: StatType;
    /**
     * Start time
     */
    startTime: number;
}