import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import {registerLocaleData} from "@angular/common";
@Injectable()
export class SettingsService {
    private locale: string;

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