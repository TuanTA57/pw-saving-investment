import test from '@playwright/test';
import { UiManager } from '../utils/ui-manager';
import { LOGIN_URL, USERNAME, PASSWORD, LOGIN_DOMAIN } from '../utils/constant-utils';

type AdminFixture = {
    ui: UiManager
}

export const adminTest = test.extend<AdminFixture>({
    ui: async ({ page }, use) => {
        let ui = new UiManager(page);
        await page.goto(LOGIN_URL);
        await ui.loginPage.onPage();
        await ui.loginPage.selectDropdownOptionByLabel('Select domain', LOGIN_DOMAIN);
        await ui.loginPage.clickButtonByLabel('Login');
        await ui.loginPage.login(USERNAME, PASSWORD);
        await ui.homePage.onPage();
        await use(ui);
    }
})