import { test, expect, Page } from '@playwright/test';

test('Verify login successfully', async ({ page }) => {
    await page.goto('http://localhost:4200/login?from=%2Fhome');
    await selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application', page);
    await clickButtonByLabel('Login', page);
    await login('Testautomatisering@able.eu', 'uCRwAtzz6tVezXrV', page);
    await expect(page.locator('.topicus-logo-text')).toBeVisible();
});

async function selectDropdownOptionByLabel(label: string, option: string, page: Page){
    let dropdownXpath = `(//label[normalize-space()='${label}']/following::mat-select[@role='combobox'])[1]`;
    let dropdownLocator = page.locator(dropdownXpath);
    await dropdownLocator.click();
    let searchLocator = page.getByPlaceholder(label);
    await searchLocator.fill(option, {force: true});
    let optionLocator = page.locator(`//mat-option[@role='option' and normalize-space()='${option}']`);
    await optionLocator.click();
}

async function clickButtonByLabel(label: string, page: Page) {
    await page.getByRole('button', {name: label}).click();
}

async function inputTextboxByLabel(label: string, input: string, page: Page) {
    let textboxXpath = `(//label[normalize-space()='${label}']/following::input)[1]`;
    await page.locator(textboxXpath).fill(input);
}

async function login(username: string, password: string, page: Page) {
    await inputTextboxByLabel('User Account', username, page);
    await inputTextboxByLabel('Password', password, page);
    await clickButtonByLabel('Sign in', page);
}