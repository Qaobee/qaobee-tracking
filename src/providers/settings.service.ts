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
@Injectable()
export class SettingsService {
    private locale: string;

    minPlayers = 4;
    maxPlayers = 10;
    sound = true;
    vibrations = true;
    wizzard = true;
    periodDuration = 30;
    periodCount = 2;

    /**
     *
     * @param {TranslateService} translate
     */
    constructor(private translate: TranslateService) {
        this.locale = translate.getBrowserLang();
        registerLocaleData(localeFr, 'fr');
        registerLocaleData(localeEn, 'en');
        registerLocaleData(localeEn, 'us');
    }

    /**
     * Get current locale
     *
     * @returns {string}
     */
    getLanguage() {
        return this.locale;
    }
}