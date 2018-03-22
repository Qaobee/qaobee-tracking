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