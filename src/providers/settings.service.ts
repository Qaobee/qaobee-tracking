import { ActivityCfgService } from './api/api.activityCfg.service';
import { Storage } from '@ionic/storage';
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
import {TranslateService} from "@ngx-translate/core";
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import {registerLocaleData} from "@angular/common";
import {ActivityCfg} from '../model/activity.cfg'
@Injectable()
export class SettingsService {
    private locale: string;
    activityCfg: ActivityCfg = new ActivityCfg();
    /**
     *
     * @param {TranslateService} translate
     * @param {Storage} storage
     * @param {ActivityCfgService} activityCfgService
     */
    constructor(private translate: TranslateService, private storage: Storage, private activityCfgService:ActivityCfgService) {
        this.locale = this.translate.getBrowserLang();
        registerLocaleData(localeFr, 'fr');
        registerLocaleData(localeEn, 'en');
        registerLocaleData(localeEn, 'us');
        this.storage.get('activityCfg').then(activityCfg =>{
            console.debug('[SettingsService] - from storage', activityCfg);
            if(!activityCfg) {
                this.activityCfgService.get('ACT-HAND').subscribe(activityCfgFromAPI => {
                    console.debug('[SettingsService] - from API', activityCfgFromAPI);
                    this.storage.set('activityCfg', activityCfgFromAPI);
                    this.init(activityCfgFromAPI);
                });
            } else {
                this.init(activityCfg);
            }
        });
    }
    init(activityCfg: any) {
        this.activityCfg = activityCfg;
    }

    save() {

    }
    /**
     * Get current locale
     *
     * @returns {string}
     */
    getLanguage() {
        return this.locale;
    }

    getCollectInfos():any {       
        return {
            initialized: true,
            periodDuration: this.activityCfg.periodDuration,
            nbMaxPlayers: this.activityCfg.nbMaxPlayers,
            nbMinPlayers: this.activityCfg.nbMinPlayers,
            nbPeriod: this.activityCfg.nbPeriod,
            nbTimeout: this.activityCfg.nbTimeout,
            timeoutDuration: this.activityCfg.timeoutDuration,
            yellowCardMax: this.activityCfg.yellowCardMax,
            exclusionTempo: this.activityCfg.exclusionTempo,
            halfTimeDuration: this.activityCfg.halfTimeDuration,
        }
    }
}