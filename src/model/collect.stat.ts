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