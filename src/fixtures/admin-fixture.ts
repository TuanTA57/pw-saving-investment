import test from '@playwright/test';
import { UiManager } from '../utils/ui-manager';
import { LOGIN_URL, USERNAME, PASSWORD, LOGIN_DOMAIN } from '../utils/constant-utils';
import i18next, { TFunction } from 'i18next';
import en from '../../locales/en.json';
import nl from '../../locales/nl.json';
import { ApiUtils } from '../api/api-utils';

type AdminFixture = {
    ui: UiManager,
    t: TFunction,
    api: ApiUtils
}

export const adminTest = test.extend<AdminFixture>({
    ui: async ({ page, locale, t }, use) => {
        const lang = locale;
        await page.addInitScript((lang: string) => localStorage.setItem('lang', lang), lang);
        await page.goto(LOGIN_URL);
        let ui = new UiManager(page, t);
        await ui.loginPage.onPage();
        await ui.loginPage.selectDropdownOptionByLabel('Select Domain', LOGIN_DOMAIN);
        await ui.loginPage.clickButtonByLabel('Login');
        await ui.loginPage.login(USERNAME, PASSWORD);
        await ui.homePage.onPage();
        await use(ui);
    },
    t: async ({ locale }, use) => {
        let i18nInstance = i18next.createInstance();
        await i18nInstance.init({
            lng: locale,
            fallbackLng: "en",
            resources: {
                en: { translation: en },
                nl: { translation: nl }
            },
            interpolation: {
                escapeValue: false
            }
        });
        await use(i18nInstance.t.bind(i18nInstance))
    },
    api: async ({ page }, use) => {
        let api = new ApiUtils(page);
        use(api);
    }
})