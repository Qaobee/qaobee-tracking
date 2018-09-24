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

export enum StatType {
    PASS = 'passOk',
    GAME_SYSTEM = 'gameSystem',
    GROUND = 'ground',
    GOAL_TARGET = 'goalTarget',
    ACTION = 'action',
    DEAD_TIME = 'deadTime',
    SWITCH_PHASE = 'switchPhase',
    OUTSIDE = 'outside',
    GOAL_SCORED = 'goalScored',
    GOAL_CONCEDED = 'goalConceded',
    IMPACT_SHOOD_DEF = 'impactShootDef',
    IMPACT_SHOOD_ATT = 'impactShootAtt',
    WOUND = 'wound',
    STOP_SHOOT = 'stopOk',
    POLE = 'pole',
    HOLDER = 'holder',
    POSITION_TYPE = 'positionType',
    SUBSTITUE = 'substitue',
    PLAY_TIME = 'playTime',
    TOTAL_PLAY_TIME = 'totalPlayTime',
    RED_CARD = 'redCard',
    YELLOW_CARD = 'yellowCard',
    ORANGE_CARD = 'exclTmp',
    stopGKDef = 'stopGKDef',
    stopGKAtt = 'stopGKAtt',
    TIME_ATTACK = 'timeAttack',
    TIME_DEFENSE = 'timeDefense',
    TIMEOUT_THEM = 'timeoutThem',
    TIMEOUT_US = 'timeoutUs',
    ORIGIN_SHOOT_ATT = 'originShootAtt',
    ORIGIN_SHOOT_DEF = 'originShootDef'
}