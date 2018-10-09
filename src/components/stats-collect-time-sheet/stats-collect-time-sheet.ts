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

import { Component, Input } from '@angular/core';
import { StatsContainerModel } from '../../model/stats.container';
import { StatsEventService } from '../../pages/events/stats.event.service';

@Component({
    selector: 'stats-collect-time-sheet',
    templateUrl: 'stats-collect-time-sheet.html'
})
export class StatsCollectTimeSheetComponent {

    @Input() ownerId: string = '';
    @Input() type: string = '';
    statsNotFound: boolean = true;
    playerList: any[];

    /**
     *
     * @param {StatsEventService} statsEventService
     */
    constructor(private statsEventService: StatsEventService) {
    }

    /**
     *
     */
    ngOnChanges() {
        if (this.type === 'EVENT') {
            this.statsEventService.getEventStats(this.ownerId).subscribe(statsContainer => {
                this.buildStats(statsContainer);
            });
        }
    }

    /**
     *
     * @param statsContainer
     */
    buildStats(statsContainer: StatsContainerModel) {
        // List of positives actions
        const actionsAttPositives = [ 'goalScored', 'penaltyObtained', 'exclTmpObtained', 'shift', 'duelWon', 'passDec' ];
        const actionsDefPositives = [ 'neutralization', 'forceDef', 'contre', 'interceptionOk', 'stopGKDef' ];

        // List of negatives actions
        const actionsAttNegatives = [ 'forceAtt', 'marcher', 'doubleDribble', 'looseball', 'foot', 'zone' ];
        const actionsDefNegatives = [ 'goalConceded', 'penaltyConceded', 'interceptionKo', 'duelLoose', 'badPosition' ];

        this.playerList = statsContainer.playerList;

        //set stat's player
        this.playerList.forEach(player => {
            //initialization
            player.stats = {
                originShootAtt: 0, originShootDef: 0, goalScored: 0, goalConceded: 0,
                yellowCard: 0, exclTmp: 0, redCard: 0, holder: false,
                totalPlayTime: 0, note: 0,
                actionsAttPositives: 0, actionsDefPositives: 0, actionsAttNegatives: 0, actionsDefNegatives: 0
            };

            //loop on statList
            statsContainer.statList.forEach(stat => {
                const foundOwner = stat.owner.find(function (element) {
                    return element === player._id;
                });

                if (foundOwner) {
                    // for each posistive action, add 1 to player's note
                    const actPosAttFound = actionsAttPositives.find(function (element) {
                        return element === stat.code;
                    });
                    if (actPosAttFound) {
                        player.stats.note = player.stats.note + 1;
                        player.stats.actionsAttPositives = player.stats.actionsAttPositives + 1;
                    }

                    const actPosDefFound = actionsDefPositives.find(function (element) {
                        return element === stat.code;
                    });
                    console.debug('[StatsCollectTimeSheetComponent] - buildStats - actPosDefFound', actPosDefFound);

                    if (actPosAttFound) {
                        player.stats.note = player.stats.note + 1;
                        player.stats.actionsDefPositives = player.stats.actionsDefPositives + 1;
                    }

                    // for each negative action, soustract 1 to player's note
                    const actNegAttFound = actionsAttNegatives.find(function (element) {
                        return element === stat.code;
                    });
                    if (actNegAttFound) {
                        player.stats.note = player.stats.note - 1;
                        player.stats.actionsAttNegatives = player.stats.actionsAttNegatives + 1;
                    }

                    const actNegDefFound = actionsDefNegatives.find(function (element) {
                        return element === stat.code;
                    });
                    if (actNegDefFound) {
                        player.stats.note = player.stats.note - 1;
                        player.stats.actionsDefNegatives = player.stats.actionsDefNegatives + 1;
                    }

                    switch (stat.code) {
                        case 'originShootAtt':
                            player.stats.originShootAtt = player.stats.originShootAtt + 1;
                            break;
                        case 'goalScored':
                            player.stats.goalScored = player.stats.goalScored + 1;
                            break;
                        case 'originShootDef':
                            player.stats.originShootDef = player.stats.originShootDef + 1;
                            break;
                        case 'goalConceded':
                            player.stats.goalConceded = player.stats.goalConceded + 1;
                            break;
                        case 'yellowCard':
                            player.stats.yellowCard = player.stats.yellowCard + 1;
                            break;
                        case 'exclTmp':
                            player.stats.exclTmp = player.stats.exclTmp + 1;
                            break;
                        case 'redCard':
                            player.stats.redCard = player.stats.redCard + 1;
                            break;
                        case 'holder':
                            player.stats.holder = true;
                            break;
                        case 'totalPlayTime':
                            player.stats.totalPlayTime = stat.value;
                            break;

                        default:
                            break;
                    }
                }
            });
        });
        this.statsNotFound = false;
    }
}
