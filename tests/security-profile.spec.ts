import { test, expect } from '@playwright/test';
import { LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';
import { UiManager } from '../src/utils/ui-manager';
let ui: UiManager;

test.beforeEach('Setup', async ({ page }) => {
    ui = new UiManager(page);
});

test('Verify security profile successfully', async ({ page }) => {
    await page.goto(LOGIN_URL);

    await ui.loginPage.selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application');
    await ui.loginPage.clickButtonByLabel('Login');
    await ui.loginPage.login(USERNAME, PASSWORD);

    await ui.homePage.onPage();
    await ui.homePage.selectMenuByLabel('Adviseur', 'Onderhoud');
    await ui.maintenancePage.onPage();
    await ui.maintenancePage.selectTabByLabel('Beveiligings profiel');
    await expect(page.getByText('Onderhoud / Beveiligings profiel')).toBeVisible();
    await ui.maintenancePage.clickButtonByDescription('beveiligings profiel toevoegen');
    await ui.maintenancePage.verifyModalHeading('Beveiligingsprofiel');
    const description = `Tuan - ${new Date().getTime()}`;
    await ui.maintenancePage.inputTextboxByLabel('Omschrijving', description);
    await ui.maintenancePage.inputTextboxByLabel('Externe code', description);
    await ui.maintenancePage.clickButtonByDescription('Opslaan');
    await ui.maintenancePage.verifyHeadingDialog('Beveiligingsprofiel toegevoegd');
    await ui.maintenancePage.verifyContentDialog('Beveiligingsprofiel is succesvol toegevoegd');
    await ui.maintenancePage.clickButtonByLabel('Sluiten');
    console.log(await ui.maintenancePage.getMatTableData('root', ['ID', 'Omschrijving', 'Externe code']));
});