import { MessageBus } from '../../providers/message-bus.service';
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
  @Input() chrono: number = 0;
  @Input() currentPhase: number = 1;
  @Input() run: boolean = false;

  @Output() onStarted = new EventEmitter<number>();
  @Output() onPaused = new EventEmitter<number>();
  @Output() onStopped = new EventEmitter<number>();
  @Output() onPeriodEnded = new EventEmitter<number>();
  @Output() onGameEnded = new EventEmitter<number>();
  @Output() chronoChange: EventEmitter<number> = new EventEmitter();
  @Output() currentPhaseChange: EventEmitter<number> = new EventEmitter();

  totalPeriod: number;

  constructor(
    private messageBus: MessageBus,
    private settingsService: SettingsService
  ) {
    this.totalPeriod = this.settingsService.getParametersGame().nbPeriod;
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
    console.debug('[ChronoComponent] - start', this.chrono);
    this.onStarted.emit(this.chrono);
    Observable.interval(1000)
      .takeWhile(() => this.run)
      .subscribe(() => {
        this.chrono += 1;
        this.chronoChange.emit(this.chrono);
        if (this.chrono > this.settingsService.getParametersGame().periodDuration * this.currentPhase) {
          if (this.currentPhase === this.settingsService.getParametersGame().nbPeriod, this.settingsService.getParametersGame().periodDuration) {
            console.debug('[ChronoComponent] - start - game ended', this.chrono, this.settingsService.getParametersGame().periodDuration);
            this.stop();
            this.onGameEnded.emit(this.chrono);
          } else {
            console.debug('[ChronoComponent] - start - period change', this.chrono, this.settingsService.getParametersGame().periodDuration);
            this.currentPhase++;
            this.currentPhaseChange.emit(this.currentPhase);
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