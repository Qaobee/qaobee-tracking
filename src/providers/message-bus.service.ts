/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.  Qaobee
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
import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable()
export class MessageBus {
    static goToLogin: any;
    public static navigation: string = 'navigation';
    public static userLogged: string = 'user-logged';
    private readonly listeners = {};
    private readonly eventsSubject = new Subject();
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
                if (this.listeners[ name ]) {
                    for (let listener of this.listeners[ name ]) {
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
        if (!this.listeners[ name ]) {
            this.listeners[ name ] = [];
        }
        this.listeners[ name ].push(listener);
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