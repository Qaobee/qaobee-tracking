import { SassHelperComponent } from './../../../components/sass-helper.component';
import { Component, ViewChild } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'page-goal-modal',
    templateUrl: 'page-goal.html',
    animations: [
        trigger('goalState', [
            state('inactive', style({
                opacity: 0,
                transform: 'translateY(100%)'
            })),
            state('active', style({
                opacity: 1,
                transform: 'translateY(0)'
            })),
            transition('inactive => active', animate('100ms ease-in-out')),
            transition('active => inactive', animate('100ms ease-in-out'))
        ]),
        trigger('groundState', [
            state('inactive', style({
                opacity: 0,
                transform: 'translateY(100%)'
            })),
            state('active', style({
                opacity: 1,
                transform: 'translateY(0)'
            })),
            transition('inactive => active', animate('100ms ease-in-out')),
            transition('active => inactive', animate('100ms ease-in-out'))
        ]),
        trigger('goalBtnState', [
            state('inactive', style({
                opacity: 0,
                transform: 'translateX(100%)'
            })),
            state('active', style({
                opacity: 1,
                transform: 'translateX(0)'
            })),
            transition('inactive => active', animate('100ms ease-in-out')),
            transition('active => inactive', animate('100ms ease-in-out'))
        ]),
        trigger('stopBtnState', [
            state('inactive', style({
                opacity: 0,
                transform: 'translateX(-100%)'
            })),
            state('active', style({
                opacity: 1,
                transform: 'translateX(0)'
            })),
            transition('inactive => active', animate('100ms ease-in-out')),
            transition('active => inactive', animate('100ms ease-in-out'))
        ])
    ]
})
export class GoalModal {
    @ViewChild(SassHelperComponent)
    private sassHelper: SassHelperComponent;
    goalState = 'inactive';
    goalBtnState = 'inactive';
    stopBtnState = 'inactive';
    groundState = 'active';
    path: { ground: string, goal: string, scorred: boolean } = { ground: '', goal: '', scorred: false };

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
        LUP: { color: 'blue-grey', opacity: 1 },
        CUP: { color: 'blue-grey', opacity: 1 },
        RUP: { color: 'blue-grey', opacity: 1 },
        LMIDDLE: { color: 'blue-grey', opacity: 1 },
        RMIDDLE: { color: 'blue-grey', opacity: 1 },
        CMIDDLE: { color: 'blue-grey', opacity: 1 },
        LDOWN: { color: 'blue-grey', opacity: 1 },
        CDOWN: { color: 'blue-grey', opacity: 1 },
        RDOWN: { color: 'blue-grey', opacity: 1 },
        'left-pole': { color: 'transparent', opacity: 0 },
        'right-pole': { color: 'transparent', opacity: 0 },
        'top-pole': { color: 'transparent', opacity: 0 },
        'outside-top': { color: 'light-green', opacity: 1 },
        'outside-left': { color: 'light-green', opacity: 1 },
        'outside-right': { color: 'light-green', opacity: 1 }
    }


    /**
     * @param  {ViewController} publicviewCtrl
     */
    constructor(public viewCtrl: ViewController) {
    }

    /**
     * @param  {string} code
     * @param  {any} event
     */
    ground(code: string, event: any) {
        console.debug('[GoalModal] action', code);
        this.reinitGround(document.getElementById("ground-map").children[0].children)
        document.getElementById(code).style.fill = this.sassHelper.readProperty('cyan');
        this.goalState = 'active';
        this.goalBtnState = 'inactive';
        this.stopBtnState = 'inactive';
        this.path.ground = code;
    }

    /**
     * @param  {string} code
     * @param  {any} event
     */
    goal(code: string, event: any) {
        console.debug('[GoalModal] action', code);
        this.reinitGoal(document.getElementById("goal-map").children[0].children)
        document.getElementById(code).style.fill = this.sassHelper.readProperty('cyan');
        document.getElementById(code).style['fill-opacity'] = 1;
        this.goalBtnState = 'active';
        this.stopBtnState = 'active';
        this.path.goal = code;
    }

    /**
     * @param  {HTMLCollection} domList
     */
    reinitGround(domList: HTMLCollection) {
        for (let i = 0; i < domList.length; i++) {
            event.target
            let elem = domList[i] as HTMLElement;
            if (this.groundMapColors[elem.id]) {
                elem.style.fill = this.sassHelper.readProperty(this.groundMapColors[elem.id]);
            }
        }
    }

    /**
     * @param  {HTMLCollection} domList
     */
    reinitGoal(domList: HTMLCollection) {
        for (let i = 0; i < domList.length; i++) {
            event.target
            let elem = domList[i] as HTMLElement;
            if (this.goalMapColors[elem.id]) {
                elem.style.fill = this.sassHelper.readProperty(this.goalMapColors[elem.id].color);
                elem.style['fill-opacity'] = this.sassHelper.readProperty(this.goalMapColors[elem.id].opacity);
            }
        }
    }

    /**
     * 
     */
    goalBtn() {
        this.path.scorred = true;
        this.viewCtrl.dismiss(this.path);
    }

    /**
     * 
     */
    stopBtn() {
        this.path.scorred = false;
        this.viewCtrl.dismiss(this.path);
    }

    /**
     * 
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }
}