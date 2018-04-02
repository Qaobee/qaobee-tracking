import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SettingsService} from "../../providers/settings.service";

@Component({
    selector: 'chrono-component',
    templateUrl: 'chrono.component.html',
})
export class ChronoComponent {
    @Input() chrono: number;
    @Input() run: boolean = false;

    @Output() onStarted = new EventEmitter<number>();
    @Output() onPaused = new EventEmitter<number>();
    @Output() onStopped = new EventEmitter<number>();
    @Output() onPeriodEnded = new EventEmitter<number>();
    @Output() onGameEnded = new EventEmitter<number>();

    timestamp: number = 0;
    currentPeriod: number= 1;
    totalPeriod: number;
    constructor(
        private settingsService: SettingsService) {
        this.totalPeriod = this.settingsService.periodCount;
    }

    format() {
       return this.chrono * 1000;
    }

    start() {
        this.run = true;
        if (!this.timestamp) {
            this.timestamp = new Date().valueOf();
            this.onStarted.emit(this.chrono);
        }
        this.chrono = Math.floor((new Date().valueOf() - this.timestamp) / 1000);
        Observable.interval(1000)
            .takeWhile(() => this.run)
            .subscribe(i => {
                this.chrono = Math.floor((new Date().valueOf() - this.timestamp) / 1000);
                if(this.chrono * 60 > this.settingsService.periodDuration * this.currentPeriod) {
                    // period change
                    if(this.currentPeriod === this.settingsService.periodCount) {
                        // game ended
                        this.stop();
                        this.onGameEnded.emit(this.chrono);
                    } else {
                        this.currentPeriod++;
                        this.pause();
                        this.onPeriodEnded.emit(this.chrono);
                    }
                }
            });
    }

    pause() {
        this.run = false;
        this.onPaused.emit(this.chrono);
    }

    stop() {
        this.run = false;
        this.onStopped.emit(this.chrono);
    }
}