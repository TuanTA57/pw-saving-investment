import { test, expect } from '@playwright/test';
import { LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';
import { LoginPage } from '../src/pages/login-page';
import { HomePage } from '../src/pages/home-page';
import { MaintenancePage } from '../src/pages/maintenance-page';
let loginPage: LoginPage;
let homePage: HomePage;
let maintenancePage: MaintenancePage;

test.beforeEach('Setup', async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    maintenancePage = new MaintenancePage(page);
});

test('Verify security profile successfully', async ({ page }) => {
    await page.goto(LOGIN_URL);

    await loginPage.selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application');
    await loginPage.clickButtonByLabel('Login');
    await loginPage.login(USERNAME, PASSWORD);

    await homePage.onPage();
    await homePage.selectMenuByLabel('Adviseur', 'Onderhoud');
    await maintenancePage.onPage();
    await maintenancePage.selectTabByLabel('Beveiligings profiel');
    await expect(page.getByText('Onderhoud / Beveiligings profiel')).toBeVisible();
    await maintenancePage.clickButtonByDescription('beveiligings profiel toevoegen');
    await maintenancePage.verifyHeadingModal('Beveiligingsprofiel');
    const description = `Tuan - ${new Date().getTime()}`;
    await maintenancePage.inputTextboxByLabel('Omschrijving', description);
    await maintenancePage.inputTextboxByLabel('Externe code', description);
    await maintenancePage.clickButtonByDescription('Opslaan');
    await maintenancePage.verifyHeadingDialog('Beveiligingsprofiel toegevoegd');
    await maintenancePage.verifyContentDialog('Beveiligingsprofiel is succesvol toegevoegd');
    await maintenancePage.clickButtonByLabel('Sluiten');
    console.log(await maintenancePage.getMatTableData('root', ['ID', 'Omschrijving', 'Externe code']));
});