import test from '@playwright/test';
import { UiManager } from '../utils/ui-manager';
import { LOGIN_URL, USERNAME, PASSWORD, LOGIN_DOMAIN } from '../utils/constant-utils';
import i18next, { TFunction } from 'i18next';
import en from '../../locales/en.json';
import nl from '../../locales/nl.json';

type AdminFixture = {
    ui: UiManager,
    t: TFunction
}

export const adminTest = test.extend<AdminFixture>({
    ui: async ({ page, t }, use) => {
        let ui = new UiManager(page, t);
        await page.goto(LOGIN_URL);
        await ui.loginPage.onPage();
        await ui.loginPage.selectDropdownOptionByLabel('Select domain', LOGIN_DOMAIN);
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
    }
})