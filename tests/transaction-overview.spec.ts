import { test, expect } from '@playwright/test';
import { LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';
import { UiManager } from '../src/utils/ui-manager';

let ui: UiManager;

test.describe('Verify reverse action', () => {
    test.beforeEach('Setup', async ({ page }) => {
        ui = new UiManager(page);
        await page.goto(LOGIN_URL);
        await ui.loginPage.onPage();
        await ui.loginPage.selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application');
        await ui.loginPage.clickButtonByLabel('Login');
        await ui.loginPage.login(USERNAME, PASSWORD);
        await ui.homePage.onPage();
        await ui.homePage.selectMenuByLabel('Transactie', 'Overzicht');
        await ui.transactionOverviewPage.onPage();
    });

    test('Verify reverse transaction when selecting reversal reason', async ({ page }) => {
        await ui.transactionOverviewPage.clickButtonByUniqueCellValue('194250802', 'Storneren');
        await ui.transactionOverviewPage.verifyDialogHeading('Storneer transactie');
        await ui.transactionOverviewPage.verifyDialogContent('Weet u zeker dat u transactie no 194250802 wilt storneren?');
        await ui.transactionOverviewPage.selectDropdownOptionByLabel('Storno reden', 'Correctie gemaakt n.a.v. klacht IM');
        let descriptionLocator = page.locator(`(//label[normalize-space()='Omschrijving']//following::textarea)[1]`);
        await expect(descriptionLocator).toHaveValue('Correctie gemaakt n.a.v. klacht IM');
        await ui.transactionOverviewPage.clickButtonByLabel('Opslaan');
        await ui.transactionOverviewPage.verifyDialogHeading('Transactie gestorneerd');
        await ui.transactionOverviewPage.verifyDialogContent('Transactie no 194250802 is succesvol gestorneerd!');
        await ui.transactionOverviewPage.clickButtonByLabel('Sluiten');
    });

    test('Verify reverse transaction when inputing only description', async () => {
        await ui.transactionOverviewPage.clickButtonByUniqueCellValue('194250802', 'Storneren');
        await ui.transactionOverviewPage.inputTextareaByLabel('Omschrijving', 'Input value for only description');
        await ui.transactionOverviewPage.clickButtonByLabel('Opslaan');
        await ui.transactionOverviewPage.verifyDialogHeading('Transactie gestorneerd');
        await ui.transactionOverviewPage.verifyDialogContent('Transactie no 194250802 is succesvol gestorneerd!');
        await ui.transactionOverviewPage.clickButtonByLabel('Sluiten');
    });

    test('Verify reverse transaction when selecting reversal reason and modifying description', async () => {
        await ui.transactionOverviewPage.clickButtonByUniqueCellValue('194250802', 'Storneren');
        await ui.transactionOverviewPage.selectDropdownOptionByLabel('Storno reden', 'Correctie gemaakt n.a.v. klacht IM');
        await ui.transactionOverviewPage.inputTextareaByLabel('Omschrijving', 'Update description');
        await ui.transactionOverviewPage.clickButtonByLabel('Opslaan');
        await ui.transactionOverviewPage.verifyDialogHeading('Transactie gestorneerd');
        await ui.transactionOverviewPage.verifyDialogContent('Transactie no 194250802 is succesvol gestorneerd!');
        await ui.transactionOverviewPage.clickButtonByLabel('Sluiten');
    });
})