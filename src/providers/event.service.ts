import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";

@Injectable()
export class EventService {
    private listeners = {};
    private eventsSubject = new Subject();
    private events;

    /**
     *
     */
    constructor() {
        this.listeners = {};
        this.eventsSubject = new Subject();

        this.events = Observable.from(this.eventsSubject);

        this.events.subscribe(
            ({name, args}) => {
                if (this.listeners[name]) {
                    for (let listener of this.listeners[name]) {
                        listener(...args);
                    }
                }
            });
    }

    /**
     *
     * @param name
     * @param listener
     */
    on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }
        this.listeners[name].push(listener);
    }

    /**
     *
     * @param name
     * @param args
     */
    broadcast(name, ...args) {
        this.eventsSubject.next({name, args});
    }
}