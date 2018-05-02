/**
 * Class describing a CollectStat
 */
export class CollectStat {
    /**
     * Activity id
     */
    activityId: string;
    /**
     * Event stat code
     */
    code: string;
    /**
     * Absolute timestamp
     */
    timer: number;
    /**
     * Producers
     * @type {any[]}
     */
    producter: string[] = [];
    /**
     * Owners
     */
    owner: string[];
    /**
     * Value
     */
    value: string;
    /**
     * Numeric value
     */
    intValue: number;
    /**
     * Event id
     */
    eventId: string;
    /**
     * Relative timer
     */
    chrono: number;
    /**
     * Shoot sequence
     */
    shootSeqId: string;
    /**
     * Phase sequence
     */
    phaseSeqId: string;
    /**
     * Is attack
     */
    attack: boolean;
}