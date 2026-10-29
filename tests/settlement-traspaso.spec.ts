import { test, expect } from '@playwright/test';
import { LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';
import { UiManager } from '../src/utils/ui-manager';

let ui: UiManager;

test.describe('Verify import action', () => {
    test.beforeEach('Setup', async ({ page }) => {
        ui = new UiManager(page);
        await page.goto(LOGIN_URL);
        await ui.loginPage.onPage();
        await ui.loginPage.selectDropdownOptionByLabel('Select domain', 'Topicus AD');
        await ui.loginPage.clickButtonByLabel('Login');
        await ui.loginPage.login(USERNAME, PASSWORD);
        await ui.homePage.onPage();
        await ui.homePage.selectMenuByLabel('Settlement', 'Trapaso');
        await ui.transactionOverviewPage.onPage();
    });

    test('Verify filter function when applying In/out criteria', async () => {
        await ui.settlementTraspasoMonitor.clickButtonByDescription('Filter');
        await ui.settlementTraspasoMonitor.selectRadioButtonByLabel('In / out', 'Both');
        await ui.settlementTraspasoMonitor.clickButtonByLabel('Apply');
    });

    test('Verify filter function when applying Date from and Date to criteria', async () => {
        await ui.settlementTraspasoMonitor.clickButtonByDescription('Filter');
        await ui.settlementTraspasoMonitor.selectRadioButtonByLabel('Date from');
        await ui.settlementTraspasoMonitor.selectRadioButtonByLabel('Date to');
        await ui.settlementTraspasoMonitor.clickButtonByLabel('Apply');
    });

    test('Verify filter function when applying Account criteria', async () => {
        await ui.settlementTraspasoMonitor.clickButtonByDescription('Filter');
        await ui.settlementTraspasoMonitor.selectTypeAheadSearchOptionByLabel('Account', '99999');
        await ui.settlementTraspasoMonitor.clickButtonByLabel('Apply');
    });

    test('Verify filter function when applying Status criteria', async () => {
        await ui.settlementTraspasoMonitor.clickButtonByDescription('Filter');
        await ui.settlementTraspasoMonitor.selectDropdownOptionByLabel('Status', 'Both');
        await ui.settlementTraspasoMonitor.clickButtonByLabel('Apply');
    });

    test('Verify that details screen is displayed correctly value', async ({ page }) => {
        await ui.transactionImportPage.selectDropdownOptionByLabel('Type', 'Uitvoeringsplaatsen');
        let filePath = 'src/data/file/impact_analyst.txt';
        await ui.transactionImportPage.uploadFileByLabel('Geen bestand gekozen *', filePath);
        await ui.transactionImportPage.selectRadioButtonByLabel('Uitvoering', 'Concept');
        await ui.transactionImportPage.clickButtonByLabel('Importeren');
        await ui.transactionImportSuccessPage.onPage();
        await expect(page.getByText(/^\s*De opdracht is succesvol ingediend met ID \d+\. Het rapport is binnenkort beschikbaar in het documentenoverzicht\.\s*$/)).toBeVisible();
    });

})