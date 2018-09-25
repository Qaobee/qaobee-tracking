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

import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChange,
    SimpleChanges,
    ViewChild
} from "@angular/core";

@Component({
    selector: 'tour-component',
    templateUrl: 'tour.component.html',
})
export class TourComponent implements OnChanges {
    @Output() onStarted = new EventEmitter<number>();
    @Output() onSkipped = new EventEmitter<number>();
    @Output() onOver = new EventEmitter<number>();
    @Input() steps: { target: string, description: string, position: string }[];

    @ViewChild('overlay') overlay: ElementRef;
    @ViewChild('tour') tour: ElementRef;
    @ViewChild('highlight') highlight: ElementRef;

    currentStep: number = -1;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        const steps: SimpleChange = changes.steps;
        console.log('prev value: ', steps.previousValue);
        console.log('got name: ', steps.currentValue);
        this.start();
    }

    ionViewDidEnter() {
        console.log('[Tour] - ionViewDidEnter', this.steps);
        this.start();
    }

    public start() {
        if (this.steps && this.steps.length > 0) {
            this.overlay.nativeElement.style.display = 'block';
            this.tour.nativeElement.style.display = 'block';
            this.highlight.nativeElement.style.display = 'block';
            this.currentStep = 0;
            this.onStarted.emit(this.currentStep);
            this.display();
        }
    }

    skip() {
        this.highlight.nativeElement.style.left = -1000 + 'px';
        this.overlay.nativeElement.style.display = 'none';
        this.tour.nativeElement.style.display = 'none';
        this.highlight.nativeElement.style.display = 'none';
        this.onSkipped.emit(this.currentStep);
        this.currentStep = -1;
    }


    swipe(event) {
        switch (event.direction) {
            case 2:
                this.next();
                break;
            case 4:
                this.previous();
                break;
        }
    }

    previous() {
        if (this.steps && this.currentStep > 0) {
            this.currentStep -= 1;
            this.display();
        }
    }

    next() {
        if (this.steps && this.currentStep < this.steps.length - 1) {
            this.currentStep += 1;
            this.display();
        }
    }

    end() {
        if (this.steps && this.currentStep === this.steps.length - 1) {
            this.overlay.nativeElement.style.display = 'none';
            this.tour.nativeElement.style.display = 'none';
            this.highlight.nativeElement.style.display = 'none';
            this.onOver.emit(this.currentStep);
        }
    }

    display() {
        if (this.currentStep >= 0 && this.steps && this.steps[ this.currentStep ]) {
            console.debug('[Tour] - display', this.currentStep, this.steps[ this.currentStep ]);
            const target = document.querySelector(this.steps[ this.currentStep ].target);
            if (!target) {
                window.setTimeout(() => {
                    this.display();
                }, 100);
            } else {
                const dims = TourComponent.offset(target as HTMLElement);
                this.highlight.nativeElement.style.top = (dims.top - 20) + 'px';
                this.highlight.nativeElement.style.left = (dims.left - 20) + 'px';
                this.highlight.nativeElement.style.width = (dims.ow + 40) + 'px';
                this.highlight.nativeElement.style.height = (dims.oh + 40) + 'px';
                this.highlight.nativeElement.innerHTML = target.outerHTML;
                this.highlight.nativeElement.children[ 0 ].className = this.highlight.nativeElement.children[ 0 ].className + ' highlighted';
                window.setTimeout(() => {
                    const tourDims = TourComponent.offset(this.tour.nativeElement);
                    switch (this.steps[ this.currentStep ].position) {
                        case 'top' :
                            this.tour.nativeElement.style.top = Math.max(0, dims.top - tourDims.oh - 10) + 'px';
                            this.tour.nativeElement.style.left = '0px';
                            break;
                        case 'right' :
                            this.tour.nativeElement.style.top = Math.max(0, dims.top - tourDims.oh / 2) + 'px';
                            this.tour.nativeElement.style.left = Math.min(window.innerWidth - tourDims.ow - 10, dims.left + dims.ow) + 'px';
                            break;
                        case 'left' :
                            this.tour.nativeElement.style.top = Math.max(0, dims.top - tourDims.oh / 2) + 'px';
                            this.tour.nativeElement.style.left = Math.max(0, dims.left - tourDims.ow - 10) + 'px';
                            break;
                        case 'bottom' :
                            this.tour.nativeElement.style.top = Math.min(window.innerHeight - tourDims.oh, dims.top + dims.oh + 20) + 'px';
                            this.tour.nativeElement.style.left = '0px';
                            break;
                    }
                }, 100);
            }
        }
    }

    static offset(el: HTMLElement) {
        let rect: any = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
            top: Math.round(rect.top + scrollTop),
            left: Math.floor(rect.left + scrollLeft),
            ow: el.offsetWidth,
            oh: el.offsetHeight
        }
    }
}