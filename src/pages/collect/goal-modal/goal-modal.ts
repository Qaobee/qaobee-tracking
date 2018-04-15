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
        LUP: 'blue-grey',
        CUP: 'blue-grey',
        RUP: 'blue-grey',
        LMIDDLE: 'blue-grey',
        RMIDDLE: 'blue-grey',
        CMIDDLE: 'blue-grey',
        LDOWN: 'blue-grey',
        CDOWN: 'blue-grey',
        RDOWN: 'blue-grey',
        'left-pole': 'transparent',
        'right-pole': 'transparent',
        'top-pole': 'transparent',
        'outside-top': 'light-green',
        'outside-left': 'light-green',
        'outside-right': 'light-green'
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
                elem.style.fill = this.sassHelper.readProperty(this.goalMapColors[elem.id]);
            }
        }
    }
}