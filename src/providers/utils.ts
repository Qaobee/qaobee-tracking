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
import {Injectable} from "@angular/core";

@Injectable()
export class Utils {
    compareEvents(a: any, b: any) {
        let valA = a.startDate || 0;
        let valB = b.startDate || 0;
        if (valA > valB) {
            return -1;
        }
        if (valA < valB) {
            return 1;
        }
        return 0;
    }
}