import { test, expect } from '@playwright/test';
import { LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';
import { UiManager } from '../src/utils/ui-manager';

let ui: UiManager;

test.describe('Verify import action', () => {
    test.beforeEach('Setup', async ({ page }) => {
        ui = new UiManager(page);
        await page.goto(LOGIN_URL);
        await ui.loginPage.onPage();
        await ui.loginPage.selectDropdownOptionByLabel('Select Domain', 'Topicus AD');
        await ui.loginPage.clickButtonByLabel('Login');
        await ui.loginPage.login(USERNAME, PASSWORD);
        await ui.homePage.onPage();
        await ui.homePage.selectMenuByLabel('Transactie', 'Importeren');
        await ui.transactionImportPage.onPage();
    });

    test('Verify import function when selecting type Transaction', async ({ page }) => {
        await ui.transactionImportPage.selectDropdownOptionByLabel('Type', 'Transacties');
        let filePath = 'src/data/file/impact_analyst.txt';
        await ui.transactionImportPage.uploadFileByLabel('Geen bestand gekozen *', filePath);
        await ui.transactionImportPage.selectRadioButtonByLabel('Uitvoering', 'Concept');
        await ui.transactionImportPage.clickButtonByLabel('Importeren');
        await ui.transactionImportSuccessPage.onPage();
        await expect(page.getByText(/^\s*De opdracht is succesvol ingediend met ID \d+\. Het rapport is binnenkort beschikbaar in het documentenoverzicht\.\s*$/)).toBeVisible();
    });
    test('Verify import function when selecting type Execution broker identifications', async ({ page }) => {
        await ui.transactionImportPage.selectDropdownOptionByLabel('Type', 'Uitvoeringsplaatsen');
        let filePath = 'src/data/file/impact_analyst.txt';
        await ui.transactionImportPage.uploadFileByLabel('Geen bestand gekozen *', filePath);
        await ui.transactionImportPage.selectRadioButtonByLabel('Uitvoering', 'Concept');
        await ui.transactionImportPage.clickButtonByLabel('Importeren');
        await ui.transactionImportSuccessPage.onPage();
        await expect(page.getByText(/^\s*De opdracht is succesvol ingediend met ID \d+\. Het rapport is binnenkort beschikbaar in het documentenoverzicht\.\s*$/)).toBeVisible();
    });

})