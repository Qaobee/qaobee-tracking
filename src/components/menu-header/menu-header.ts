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
import {Component, Input} from '@angular/core';
import {ENV} from '@app/env'
import {ProfilePage} from "../../pages/profile/profile";
import {MessageBus} from "../../providers/event.service";

@Component({
    selector: 'menu-header',
    templateUrl: 'menu-header.html'
})
export class MenuHeaderComponent {
    @Input() user: any;

    root: string = ENV.hive;

    /**
     *
     * @param {MessageBus} eventService
     */
    constructor(private eventService: MessageBus) {
    }

    /**
     *
     */
    goToProfile() {
        console.log('[MenuHeaderComponent] - goToProfile');
        this.eventService.broadcast(MessageBus.navigation, {component: ProfilePage});
    }

}
