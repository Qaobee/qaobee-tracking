import { Component, Input } from '@angular/core';
import { ENV } from '@app/env'
import { ProfilePage } from "../../pages/profile/profile";
import { MessageBus } from "../../providers/message-bus.service";

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

    /**
     *
     * @param {string} avatar
     * @returns {string}
     */
    getAvatar(avatar: string) {
        if (avatar && avatar !== 'null') {
            return this.root + '/file/User/' + avatar;
        } else {
            return '/assets/imgs/user.png';
        }
    }
}
