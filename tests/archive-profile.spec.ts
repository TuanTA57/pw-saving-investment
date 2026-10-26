import { test, expect } from '@playwright/test';
import { sortJson } from '../src/utils/json-utils';
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
})

test('Verify archive profile successfully', async ({ page }) => {
    await page.goto(LOGIN_URL);

    await loginPage.onPage();
    await loginPage.selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application');
    await loginPage.clickButtonByLabel('Login');
    await loginPage.login(USERNAME, PASSWORD);
    await homePage.onPage();
    await homePage.selectMenuByLabel('Adviseur', 'Onderhoud');

    await maintenancePage.onPage();
    await maintenancePage.selectTabByLabel('Archief profiel');
    await expect(page.getByText('Onderhoud / Archief profiel')).toBeVisible();

    await maintenancePage.clickButtonByDescription('Archief profiel toevoegen');
    await maintenancePage.verifyHeadingModal('Archief profiel');
    const description = `Tuan - ${new Date().getTime()}`;
    await maintenancePage.inputTextboxByLabel('Omschrijving', description);
    await maintenancePage.inputTextboxByLabel('Externe code', '1234');
    let docmumentTypes = ['AFAT - Afloop AT Controle Proces', 'ANAV - Aanmelding AVA'];
    await maintenancePage.selectDropdownOptionsByLabel('Document type', docmumentTypes);
    await maintenancePage.clickButtonByDescription('Opslaan');
    await maintenancePage.verifyHeadingDialog('Archief profiel toegevoegd');
    await maintenancePage.verifyContentDialog('Archief profiel succesvol toegevoegd');
    await maintenancePage.clickButtonByLabel('Sluiten');
    await maintenancePage.viewDetailsByUniqueCellValue(description);
    await maintenancePage.verifyHeadingPage(/^Onderhoud *\/ *Archief profiel (\d+) *\/ *Details$/);
    const expectedDescriptionRegex = new RegExp(`Omschrijving\\s*${description}`);
    await expect(page.getByText(expectedDescriptionRegex)).toBeVisible();
    await expect(page.getByText('Externe code  1234')).toBeVisible();
    const actualDocumentTypeValues = await maintenancePage.getExpansionTableDataByLabel('Document types', ['Type']);
    let expectedDocumentTypes = docmumentTypes.map(value => {
        return { Type: value }
    });
    expect(actualDocumentTypeValues.length).toEqual(docmumentTypes.length);
    expect(sortJson(actualDocumentTypeValues)).toEqual(expect.arrayContaining(sortJson(expectedDocumentTypes)));
});