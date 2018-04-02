import {Component} from "@angular/core";
import {ENV} from "@app/env";

@Component({
    selector: 'page-collect',
    templateUrl: 'collect.html',
})
export class CollectPage {
    root: string = ENV.hive;
    chrono: number = 0;
    playerPositions: any = {
        substitutes: []
    };

    ground = [
        [{key: 'pivot', label: 'Pivot', class: 'pivot'}],
        [{key: 'left-backcourt', label: 'Back-court', class: ''}, {
            key: 'center-backcourt',
            label: 'Back-court'
        }, {key: 'right-backcourt', label: 'Back-court'}],
        [{key: 'left-wingman', label: 'Wing-man'}, {key: 'goalkeeper', label: 'Goalkeeper', class: 'goalkeeper'}, {
            key: 'right-wingman',
            label: 'Wing-man'
        }]
    ];

    /**
     *
     * @param {string} avatar
     * @returns {string}
     */
    getAvatar(avatar: string) {
        if (avatar && avatar !== 'null') {
            return this.root + '/file/SB_Person/' + avatar;
        } else {
            return '/assets/imgs/user.png';
        }
    }
}