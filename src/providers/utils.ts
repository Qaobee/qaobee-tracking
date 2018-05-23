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
import _ from "lodash";

@Injectable()
export class Utils {

    /**
     * @param  {any} a
     * @param  {any} b
     * @returns number
     */
    static compareEvents(a: any, b: any): number {
        let valA = a.startDate || 0;
        let valB = b.startDate || 0;
        if (valA > valB) {
            return 1;
        }
        if (valA < valB) {
            return -1;
        }
        return 0;
    }

    /**
     * @param  {any[]} collection
     * @param  {string} field
     * @returns any
     */
    static groupBy(collection: any[], field: string): any {
        let map = {};
        collection.forEach((obj: any) => {
            let key = obj[ field ];
            if (!map[ key ]) {
                map[ key ] = [];
            }
            map[ key ].push(obj);
        });
        return map;
    }

    /**
     * @param  {any[]} array
     * @param  {string} field
     * @param  {string[]} excludedkeys
     * @returns any[]
     */
    static filter(array: any[], field: string, excludedkeys: string[]): any[] {
        let jar = [];
        array.forEach(item => {
            if (excludedkeys.indexOf(item[ field ]) === -1) {
                jar.push(item);
            }
        });
        return jar;
    }

    /**
     * Generate a GUID
     * @returns {string}
     */
    static generateGUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Find differences between objects
     *
     * @param  {any} object
     * @param  {any} base
     */
    static objDiff(object: any, base: any) {
        return _.transform(object, function (result, value, key) {
            if (!_.isEqual(value, base[ key ])) {
                result[ key ] = (_.isObject(value) && _.isObject(base[ key ])) ? Utils.objDiff(value, base[ key ]) : value;
            }
        });
    }

    /**
     * Arround decimal number
     *
     * @param number
     * @param precision
     */
    static precisionRound(number, precision) {
        let factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }
}