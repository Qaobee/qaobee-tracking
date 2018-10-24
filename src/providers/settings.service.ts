/*
 *  __________________
 *  Qaobee
 *  __________________
 *
 *  Copyright (c) 2015.
 *  Qaobee
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

import { registerLocaleData } from "@angular/common";
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
import { ActivityCfgService } from './api/api.activityCfg.service';
import { Observable } from "rxjs";

@Injectable()
export class SettingsService {
    readonly locale: string;
    private activityCfg: any;

    /**
     *
     * @param {TranslateService} translate
     * @param {Storage} storage
     * @param {ActivityCfgService} activityCfgService
     */
    constructor(private translate: TranslateService, private storage: Storage, private activityCfgService: ActivityCfgService) {
        this.locale = this.translate.getBrowserLang();
        registerLocaleData(localeFr, 'fr');
        registerLocaleData(localeEn, 'en');
        registerLocaleData(localeEn, 'us');
        this.init();
    }

    /**
     *
     */
    init() {
        return new Observable<any>((observer) => {
            this.storage.get('activityCfg').then(activityCfg => {
                console.debug('[SettingsService] - from storage', activityCfg);
                if (!activityCfg) {
                    this.activityCfgService.get('ACT-HAND').subscribe(activityCfgFromAPI => {
                        console.debug('[SettingsService] - from API', activityCfgFromAPI);
                        this.storage.set('activityCfg', activityCfgFromAPI);
                        this.activityCfg = activityCfgFromAPI;
                        observer.next(this.activityCfg);
                        observer.complete();
                    });
                } else {
                    this.activityCfg = activityCfg;
                    observer.next(this.activityCfg);
                    observer.complete();
                }
            });
        });
    }

    /**
     *
     */
    save() {
        this.storage.set('activityCfg', this.activityCfg);
    }

    /**
     * Get current locale
     *
     * @returns {string}
     */
    getLanguage(): string {
        return this.locale;
    }

    getParametersGame(): Observable<{ periodDuration: number,  periodDurationMinute: number, nbMaxPlayers: number, nbMinPlayers: number, nbPeriod: number, nbTimeout: number, timeoutDuration: number, yellowCardMax: number, exclusionTempo: number, halfTimeDuration: number }> {
        return new Observable<any>((observer) => {
            this.init().subscribe(() => {
                observer.next(this.activityCfg.parametersGame);
                observer.complete();
            });
        });
    }

    setParametersGame(parameters: { periodDuration: number, periodDurationMinute: number, nbMaxPlayers: number, nbMinPlayers: number, nbPeriod: number, nbTimeout: number, timeoutDuration: number, yellowCardMax: number, exclusionTempo: number, halfTimeDuration: number }) {
        this.activityCfg.parametersGame = parameters;
        this.save();
    }

    getActivityConfig(): any {
        return this.activityCfg;
    }
}