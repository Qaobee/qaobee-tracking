import { SassHelperComponent } from './../../../components/sass-helper.component';
import { Component, ViewChild } from '@angular/core';

@Component({
    selector: 'page-goal-modal',
    templateUrl: 'page-goal.html',
})
export class GoalModal {
    @ViewChild(SassHelperComponent)
    private sassHelper: SassHelperComponent;
    private groundMapColors: any = {
        PENALTY: 'red',
        CENTER9: 'light-green',
        BACKLEFT9: 'light-green',
        BACKRIGHT9: 'light-green',
        RWING: 'light-green',
        BACKRIGHT6: 'light-green',
        CENTER6: 'light-green',
        BACKLEFT6: 'light-green',
        LWING: 'light-green'
    }
    private goalMapColors: any = {
        LUP: { color: 'blue-grey', opacity: 1},
        CUP: { color: 'blue-grey',opacity: 1},
        RUP: { color: 'blue-grey',opacity: 1},
        LMIDDLE: { color: 'blue-grey',opacity: 1},
        RMIDDLE: { color: 'blue-grey',opacity: 1},
        CMIDDLE: { color: 'blue-grey',opacity: 1},
        LDOWN: { color: 'blue-grey',opacity: 1},
        CDOWN: { color: 'blue-grey',opacity: 1},
        RDOWN: { color: 'blue-grey',opacity: 1},
        'left-pole': { color: 'transparent',opacity: 0},
        'right-pole': { color: 'transparent',opacity: 0},
        'top-pole': { color: 'transparent',opacity: 0},
        'outside-top': { color: 'light-green',opacity: 1},
        'outside-left': { color: 'light-green',opacity: 1},
        'outside-right': { color: 'light-green',opacity: 1}
    }

    constructor() {
    }

    ground(code, event) {
        console.debug('[GoalModal] action', code);
        this.reinitGround(document.getElementById("ground-map").children[0].children)
        document.getElementById(code).style.fill = this.sassHelper.readProperty('cyan');
    }
    goal(code, event) {
        console.debug('[GoalModal] action', code);
        this.reinitGoal(document.getElementById("goal-map").children[0].children)
        document.getElementById(code).style.fill = this.sassHelper.readProperty('cyan');
        document.getElementById(code).style['fill-opacity'] = 1;
    }

    reinitGround(domList) { 
        for(let i=0; i < domList.length; i++) {event.target
            let elem = domList[i]
            if (this.groundMapColors[elem.id]) {
                elem.style.fill = this.sassHelper.readProperty(this.groundMapColors[elem.id]);
            }
        }
    }

    reinitGoal(domList) { 
        for(let i=0; i < domList.length; i++) {event.target
            let elem = domList[i]
            if (this.goalMapColors[elem.id]) {
                elem.style.fill = this.sassHelper.readProperty(this.goalMapColors[elem.id].color);
                elem.style['fill-opacity'] = this.sassHelper.readProperty(this.goalMapColors[elem.id].opacity);
            }
        }
    }
}