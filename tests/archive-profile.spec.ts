import { test, expect } from '@playwright/test';
import { sortJson } from '../src/utils/json-utils';
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
})

test('Verify archive profile successfully', async ({ page }) => {
    await page.goto(LOGIN_URL);

    await loginPage.selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application');
    await loginPage.clickButtonByLabel('Login');
    await loginPage.login(USERNAME, PASSWORD);
    await expect(page.locator('.topicus-logo-text')).toBeVisible();
    await homePage.selectMenuByLabel('Adviseur', 'Onderhoud');

    await maintanancePage.verifyHeadingPage('Onderhoud / Overzicht');
    await maintanancePage.selectTabByLabel('Archief profiel');
    await expect(page.getByText('Onderhoud / Archief profiel')).toBeVisible();

    await maintanancePage.clickButtonByDescription('Archief profiel toevoegen');
    await maintanancePage.verifyHeadingModal('Archief profiel');
    const description = `Tuan - ${new Date().getTime()}`;
    await maintanancePage.inputTextboxByLabel('Omschrijving', description);
    await maintanancePage.inputTextboxByLabel('Externe code', '1234');
    let docmumentTypes = ['AFAT - Afloop AT Controle Proces', 'ANAV - Aanmelding AVA'];
    await maintanancePage.selectDropdownOptionsByLabel('Document type', docmumentTypes);
    await maintanancePage.clickButtonByDescription('Opslaan');
    await maintanancePage.verifyHeadingDialog('Archief profiel toegevoegd');
    await maintanancePage.verifyContentDialog('Archief profiel succesvol toegevoegd');
    await maintanancePage.clickButtonByLabel('Sluiten');
    await maintanancePage.viewDetailsByUniqueCellValue(description);
    await maintanancePage.verifyHeadingPage(/^Onderhoud *\/ *Archief profiel (\d+) *\/ *Details$/);
    const expectedDescriptionRegex = new RegExp(`Omschrijving\\s*${description}`);
    await expect(page.getByText(expectedDescriptionRegex)).toBeVisible();
    await expect(page.getByText('Externe code  1234')).toBeVisible();
    const actualDocumentTypeValues = await maintanancePage.getExpansionTableDataByLabel('Document types', ['Type']);
    let expectedDocumentTypes = docmumentTypes.map(value => {
        return { Type: value }
    });
    expect(actualDocumentTypeValues.length).toEqual(docmumentTypes.length);
    expect(sortJson(actualDocumentTypeValues)).toEqual(expect.arrayContaining(sortJson(expectedDocumentTypes)));
});