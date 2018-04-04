import { MessageBus } from './../../providers/message-bus.service';
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { SettingsService } from "../../providers/settings.service";

@Component({
    selector: 'chrono-component',
    templateUrl: 'chrono.component.html',
})
export class ChronoComponent {
    static PAUSE = 'chrono-component-pause';
    static PLAY = 'chrono-component-play';
    static STOP = 'chrono-component-toggle';
    @Input() chrono: number;
    @Input() currentPhase: number = 1;
    @Input() run: boolean = false;

    @Output() onStarted = new EventEmitter<number>();
    @Output() onPaused = new EventEmitter<number>();
    @Output() onStopped = new EventEmitter<number>();
    @Output() onPeriodEnded = new EventEmitter<number>();
    @Output() onGameEnded = new EventEmitter<number>();

    timestamp: number = 0;
    totalPeriod: number;

    constructor(
        private messageBus: MessageBus,
        private settingsService: SettingsService
    ) {
        this.totalPeriod = this.settingsService.periodCount;
        this.messageBus.on(ChronoComponent.PAUSE, () => {
            this.pause();
        });
        this.messageBus.on(ChronoComponent.PLAY, () => {
            this.start();
        });
        this.messageBus.on(ChronoComponent.STOP, () => {
            this.stop();
        });
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
                if (this.chrono * 60 > this.settingsService.periodDuration * this.currentPhase) {
                    // period change
                    if (this.currentPhase === this.settingsService.periodCount) {
                        // game ended
                        this.stop();
                        this.onGameEnded.emit(this.chrono);
                    } else {
                        this.currentPhase++;
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