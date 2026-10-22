import { test, expect } from '@playwright/test';
import { LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';
import { LoginPage } from '../src/pages/login-page';
import { HomePage } from '../src/pages/home-page';
import { MaintenancePage } from '../src/pages/maintenance-page';
let loginPage: LoginPage;
let homePage: HomePage;
let maintanancePage: MaintenancePage;

test.beforeEach('Setup', async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    maintanancePage = new MaintenancePage(page);
});

test('Verify security profile successfully', async ({ page }) => {
    await page.goto(LOGIN_URL);

    await loginPage.selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application');
    await loginPage.clickButtonByLabel('Login');
    await loginPage.login(USERNAME, PASSWORD);

    await expect(page.locator('.topicus-logo-text')).toBeVisible();
    await homePage.selectMenuByLabel('Adviseur', 'Onderhoud');
    await maintanancePage.verifyHeadingPage('Onderhoud / Overzicht');
    await maintanancePage.selectTabByLabel('Beveiligings profiel');
    await expect(page.getByText('Onderhoud / Beveiligings profiel')).toBeVisible();
    await maintanancePage.clickButtonByDescription('beveiligings profiel toevoegen');
    await maintanancePage.verifyHeadingModal('Beveiligingsprofiel');
    const description = `Tuan - ${new Date().getTime()}`;
    await maintanancePage.inputTextboxByLabel('Omschrijving', description);
    await maintanancePage.inputTextboxByLabel('Externe code', description);
    await maintanancePage.clickButtonByDescription('Opslaan');
    await maintanancePage.verifyHeadingDialog('Beveiligingsprofiel toegevoegd');
    await maintanancePage.verifyContentDialog('Beveiligingsprofiel is succesvol toegevoegd');
    await maintanancePage.clickButtonByLabel('Sluiten');
    console.log(await maintanancePage.getMatTableData('root', ['ID', 'Omschrijving', 'Externe code']));
});