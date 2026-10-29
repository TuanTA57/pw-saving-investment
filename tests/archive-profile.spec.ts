import { test, expect } from '@playwright/test';
import { sortJson } from '../src/utils/json-utils';
import { LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';
import { UiManager } from '../src/utils/ui-manager';

let ui: UiManager;

test.beforeEach('Setup', async ({ page }) => {
    ui = new UiManager(page);
})

test('Verify archive profile successfully', async ({ page }) => {
    await page.goto(LOGIN_URL);

    await ui.loginPage.onPage();
    await ui.loginPage.selectDropdownOptionByLabel('Select domain', 'epic-test-client - Native application');
    await ui.loginPage.clickButtonByLabel('Login');
    await ui.loginPage.login(USERNAME, PASSWORD);
    await ui.homePage.onPage();
    await ui.homePage.selectMenuByLabel('Adviseur', 'Onderhoud');

    await ui.maintenancePage.onPage();
    await ui.maintenancePage.selectTabByLabel('Archief profiel');
    await expect(page.getByText('Onderhoud / Archief profiel')).toBeVisible();

    await ui.maintenancePage.clickButtonByDescription('Archief profiel toevoegen');
    await ui.maintenancePage.verifyModalHeading('Archief profiel');
    const description = `Tuan - ${new Date().getTime()}`;
    await ui.maintenancePage.inputTextboxByLabel('Omschrijving', description);
    await ui.maintenancePage.inputTextboxByLabel('Externe code', '1234');
    let docmumentTypes = ['AFAT - Afloop AT controle proces', 'ANAV - Aanmelding AVA'];
    await ui.maintenancePage.selectDropdownOptionsByLabel('Document type', docmumentTypes);
    await ui.maintenancePage.clickButtonByDescription('Opslaan');
    await ui.maintenancePage.verifyDialogHeading('Archief profiel toegevoegd');
    await ui.maintenancePage.verifyDialogContent('Archief profiel succesvol toegevoegd');
    await ui.maintenancePage.clickButtonByLabel('Sluiten');
    await ui.maintenancePage.clickRowByUniqueCellValue(description);
    await ui.maintenancePage.verifyPageHeading(/^Onderhoud *\/ *Archief profiel (\d+) *\/ *Details$/);
    const expectedDescriptionRegex = new RegExp(`Omschrijving\\s*${description}`);
    await expect(page.getByText(expectedDescriptionRegex)).toBeVisible();
    await expect(page.getByText('Externe code  1234')).toBeVisible();
    const actualDocumentTypeValues = await ui.maintenancePage.getExpansionTableDataByLabel('Document types', ['Type']);
    let expectedDocumentTypes = docmumentTypes.map(value => {
        return { Type: value }
    });
    expect(actualDocumentTypeValues.length).toEqual(docmumentTypes.length);
    expect(sortJson(actualDocumentTypeValues)).toEqual(expect.arrayContaining(sortJson(expectedDocumentTypes)));
});