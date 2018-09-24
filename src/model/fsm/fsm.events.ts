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
 * Events
 */
export enum FSMEvents {
    startChrono = 'startChrono',
    doPause = 'doPause',
    doAttack = 'doAttack',
    doDefense = 'doDefense',
    selectPlayer = 'selectPlayer',
    groundAtt = 'groundAtt',
    groundDef = 'groundDef',
    goalShotAtt = 'goalShotAtt',
    goalShotDef = 'goalShotDef',
    poleShotAtt = 'poleShotAtt',
    poleShotDef = 'poleShotDef',
    cornerShotAtt = 'cornerShotAtt',
    cornerShotDef = 'cornerShotDef',
    stopShootAtt = 'stopShootAtt',
    stopShootDef = 'stopShootDef',
    goalScoredAtt = 'goalScoredAtt',
    goalScoredDef = 'goalScoredDef',
    outsideAtt = 'outsideAtt',
    outsideDef = 'outsideDef',
    timeout = 'timeout',
    stopTimer = 'stopTimer',
    sanction = 'sanction',
    wound = 'wound',
    goToSelectPlayer = 'goToSelectPlayer',
    resume = 'resume',
    restoreGroundState = 'restoreGroundState',
    restoreGoalState = 'restoreGoalState',
    leaveGoal = 'leaveGoal',
    leaveGround = 'leaveGround',
    backDone = 'backDone',
    endChrono = 'endChrono'
}
