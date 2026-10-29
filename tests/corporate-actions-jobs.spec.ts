import { test} from '@playwright/test';
import { LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';
import { UiManager } from '../src/utils/ui-manager';

let ui: UiManager;

test.describe('Verify jobs screen', () => {
    test.beforeEach('Setup', async ({ page }) => {
        ui = new UiManager(page);
        await page.goto(LOGIN_URL);
        await ui.loginPage.onPage();
        await ui.loginPage.selectDropdownOptionByLabel('Select domain', 'epic-test-client - Native application');
        await ui.loginPage.clickButtonByLabel('Login');
        await ui.loginPage.login(USERNAME, PASSWORD);
        await ui.homePage.onPage();
        await ui.homePage.selectMenuByLabel('Corporate actions', 'Jobs');
        await ui.corporateActionsJobsPage.onPage();
    });

    test('Verify active bank savings accounts job', async () => {
        await ui.corporateActionsJobsPage.inputTextboxByLabel('Zoeken', 'Actieve bankspaarrekeningen');
        await ui.corporateActionsJobsPage.clickRowByUniqueCellValue('Actieve bankspaarrekeningen');
        await ui.corporateActionsJobsPage.verifyPageHeading('Actieve bankspaarrekeningen');
        await ui.corporateActionsJobsPage.verifySectionTitleInForm('Opdracht parameters');
        await ui.corporateActionsJobsPage.selectDropdownOptionsByLabel('Product', ['6320 - Private Banking']);
        await ui.corporateActionsJobsPage.clickButtonByLabel('Volgende');
        await ui.corporateActionsJobsPage.verifySectionTitleInForm('Schema');
        await ui.corporateActionsJobsPage.clickButtonByLabel('Opslaan');
        await ui.corporateActionsJobsPage.verifyDialogHeading('Job aangemaakt');
        await ui.corporateActionsJobsPage.verifyDialogContent(/^Job (\d+) is succesvol aangemaakt.$/);
        await ui.corporateActionsJobsPage.clickButtonByLabel('Sluiten');
    });

    test('Verify fiscal control bank savings accounts job', async () => {
        await ui.corporateActionsJobsPage.inputTextboxByLabel('Zoeken', 'Fiscale controle bankspaarrekeningen');
        await ui.corporateActionsJobsPage.clickRowByUniqueCellValue('Fiscale controle bankspaarrekeningen');
        await ui.corporateActionsJobsPage.verifyPageHeading('Fiscale controle bankspaarrekeningen');
        await ui.corporateActionsJobsPage.verifySectionTitleInForm('Opdracht parameters');
        await ui.corporateActionsJobsPage.selectDropdownOptionsByLabel('Product', ['6320 - Private Banking']);
        await ui.corporateActionsJobsPage.clickButtonByLabel('Volgende');
        await ui.corporateActionsJobsPage.verifySectionTitleInForm('Schema');
        await ui.corporateActionsJobsPage.clickButtonByLabel('Opslaan');
        await ui.corporateActionsJobsPage.verifyDialogHeading('Job aangemaakt');
        await ui.corporateActionsJobsPage.verifyDialogContent(/^Job (\d+) is succesvol aangemaakt.$/);
        await ui.corporateActionsJobsPage.clickButtonByLabel('Sluiten');
    });

    test('Verify import choice dividend job', async () => {
        await ui.corporateActionsJobsPage.inputTextboxByLabel('Zoeken', 'Importeren keuzedividend');
        await ui.corporateActionsJobsPage.clickRowByUniqueCellValue('Importeren keuzedividend');
        await ui.corporateActionsJobsPage.verifyPageHeading('Importeren keuzedividend');
        let filePath = 'src/data/file/impact_analyst.txt';
        await ui.corporateActionsJobsPage.uploadFileByLabel('Geen bestand gekozen *', filePath);
        await ui.corporateActionsJobsPage.clickButtonByLabel('Opslaan');
        await ui.corporateActionsJobsPage.verifyDialogHeading('Job aangemaakt');
        await ui.corporateActionsJobsPage.verifyDialogContent(/^Job (\d+) is succesvol aangemaakt.$/);
        await ui.corporateActionsJobsPage.clickButtonByLabel('Sluiten');
    });

    test('Verify portfolio conversion job', async () => {
        await ui.corporateActionsJobsPage.inputTextboxByLabel('Zoeken', 'Portefeuille conversie');
        await ui.corporateActionsJobsPage.clickRowByUniqueCellValue('Portefeuille conversie');
        await ui.corporateActionsJobsPage.verifyPageHeading('Portefeuille conversie');
        await ui.corporateActionsJobsPage.verifySectionTitleInForm('Opdracht parameters');
        await ui.corporateActionsJobsPage.selectRadioButtonByLabel('Richting', 'Marktstukken naar BGS');
        await ui.corporateActionsJobsPage.selectTypeAheadSearchOptionByLabel('Rekening *', '98990911');
        await ui.corporateActionsJobsPage.selectRadioButtonByLabel('Uitvoering', 'Concept');
        await ui.corporateActionsJobsPage.clickButtonByLabel('Volgende');
        await ui.corporateActionsJobsPage.verifySectionTitleInForm('Schema');
        await ui.corporateActionsJobsPage.clickButtonByLabel('Opslaan');
        await ui.corporateActionsJobsPage.verifyDialogHeading('Job aangemaakt');
        await ui.corporateActionsJobsPage.verifyDialogContent(/^Job (\d+) is succesvol aangemaakt.$/);
        await ui.corporateActionsJobsPage.clickButtonByLabel('Sluiten');
    });
});