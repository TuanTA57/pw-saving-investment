import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { LOGIN_URL } from '../src/utils/constant-utils';

let loginPage: LoginPage;
test.beforeEach('Setup', async({page}) => {
    loginPage = new LoginPage(page);
})

test('Verify login successfully', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await loginPage.selectDropdownOptionByLabel('Select domain', 'epic-test-client - Native application');
    await loginPage.clickButtonByLabel('Login');
    await loginPage.login('Testautomatisering@able.eu', 'uCRwAtzz6tVezXrV');
    await expect(page.locator('.topicus-logo-text')).toBeVisible();
});