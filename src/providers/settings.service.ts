import { registerLocaleData } from "@angular/common";
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
import { ActivityCfgService } from './api/api.activityCfg.service';

@Injectable()
export class SettingsService {
  readonly locale: string;
  activityCfg: { periodDuration: number, nbMaxPlayers: number, nbMinPlayers: number, nbPeriod: number, nbTimeout: number, timeoutDuration: number, yellowCardMax: number, exclusionTempo: number, halfTimeDuration: number };
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
    this.storage.get('activityCfg').then(activityCfg => {
      console.debug('[SettingsService] - from storage', activityCfg);
      if (!activityCfg) {
        this.activityCfgService.get('ACT-HAND').subscribe(activityCfgFromAPI => {
          console.debug('[SettingsService] - from API', activityCfgFromAPI);
          this.storage.set('activityCfg', activityCfgFromAPI);
          this.activityCfg = activityCfgFromAPI;
        });
      } else {
        this.activityCfg = activityCfg;
      }
    });
  }

  /**
   * 
   */
  save() {

  }

  /**
   * Get current locale
   *
   * @returns {string}
   */
  getLanguage(): string {
    return this.locale;
  }
}