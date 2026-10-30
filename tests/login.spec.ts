import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { LOGIN_DOMAIN, LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';

let loginPage: LoginPage;
test.beforeEach('Setup', async({page}) => {
    loginPage = new LoginPage(page);
})

test('Verify login successfully', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await loginPage.selectDropdownOptionByLabel('Select domain', LOGIN_DOMAIN);
    await loginPage.clickButtonByLabel('Login');
    await loginPage.login(USERNAME, PASSWORD);
    await expect(page.locator('.topicus-logo-text')).toBeVisible();
});