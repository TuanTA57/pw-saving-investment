import { expect } from '@playwright/test';
import { adminTest } from '../src/fixtures/admin-fixture';

adminTest.describe('Transaction import', () => {
    adminTest.beforeEach('Set up', async ({ui}) => {
        await ui.homePage.selectMenuByLabel('Transaction', 'Import');
    })
    adminTest('Verify import function when selecting type Transaction', async ({ page, ui, t }) => {
        await ui.transactionImportPage.onPage();
        await ui.transactionImportPage.selectDropdownOptionByLabel('Type', 'Transacties');
        let filePath = 'src/data/file/impact_analyst.txt';
        await ui.transactionImportPage.uploadFileByLabel('Geen bestand gekozen *', filePath);
        await ui.transactionImportPage.selectRadioButtonByLabel('Uitvoering', 'Concept');
        await ui.transactionImportPage.clickButtonByLabel('Importeren');
        await ui.transactionImportSuccessPage.onPage();
        await expect(page.getByText(/^\s*De opdracht is succesvol ingediend met ID \d+\. Het rapport is binnenkort beschikbaar in het documentenoverzicht\.\s*$/)).toBeVisible();
    });
    adminTest('Verify import function when selecting type Execution broker identifications', async ({ page, ui }) => {
        await ui.transactionImportPage.selectDropdownOptionByLabel('Type', 'Uitvoeringsplaatsen');
        let filePath = 'src/data/file/impact_analyst.txt';
        await ui.transactionImportPage.uploadFileByLabel('Geen bestand gekozen *', filePath);
        await ui.transactionImportPage.selectRadioButtonByLabel('Uitvoering', 'Concept');
        await ui.transactionImportPage.clickButtonByLabel('Importeren');
        await ui.transactionImportSuccessPage.onPage();
        await expect(page.getByText(/^\s*De opdracht is succesvol ingediend met ID \d+\. Het rapport is binnenkort beschikbaar in het documentenoverzicht\.\s*$/)).toBeVisible();
    });
})