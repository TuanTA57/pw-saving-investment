import { test, expect } from '@playwright/test';
import { LOGIN_URL, PASSWORD, USERNAME } from '../src/utils/constant-utils';
import { LoginPage } from '../src/pages/login-page';
import { HomePage } from '../src/pages/home-page';
import { TransactionOverviewPage } from '../src/pages/transaction-overview-page';

let loginPage: LoginPage;
let homePage: HomePage;
let transactionOverviewPage: TransactionOverviewPage;
test.describe('Verify reverse action', () => {
    test.beforeEach('Setup', async ({ page }) => {
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        transactionOverviewPage = new TransactionOverviewPage(page);
        await page.goto(LOGIN_URL);
        await loginPage.selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application');
        await loginPage.clickButtonByLabel('Login');
        await loginPage.login(USERNAME, PASSWORD);
        await homePage.selectMenuByLabel('Transactie', 'Overzicht');
        await transactionOverviewPage.verifyHeadingPage('Transactie overzicht');
    });
    
    test('Verify reverse transaction when selecting reversal reason', async ({ page }) => {
        await transactionOverviewPage.clickButtonByUniqueCellValue('194250734', 'Storneren');
        await transactionOverviewPage.verifyHeadingDialog('Storneer transactie');
        await transactionOverviewPage.verifyContentDialog('Weet u zeker dat u transactie no 194250734 wilt storneren?');
        await transactionOverviewPage.selectDropdownOptionByLabel('Storno reden', 'Correctie gemaakt n.a.v. klacht IM');
        let descriptionLocator = page.locator(`(//label[normalize-space()='Omschrijving']//following::textarea)[1]`);
        await expect(descriptionLocator).toHaveValue('Correctie gemaakt n.a.v. klacht IM');
        await transactionOverviewPage.clickButtonByLabel('Opslaan');
        await transactionOverviewPage.verifyHeadingDialog('Transactie gestorneerd');
        await transactionOverviewPage.verifyContentDialog('Transactie no 194250734 is succesvol gestorneerd!');
        await transactionOverviewPage.clickButtonByLabel('Sluiten');
    });
    
    test('Verify reverse transaction when inputing only description', async () => {
        await transactionOverviewPage.clickButtonByUniqueCellValue('194250734', 'Storneren');
        await transactionOverviewPage.inputTextareaByLabel('Omschrijving', 'Input value for only description');
        await transactionOverviewPage.clickButtonByLabel('Opslaan');
        await transactionOverviewPage.verifyHeadingDialog('Transactie gestorneerd');
        await transactionOverviewPage.verifyContentDialog('Transactie no 194250734 is succesvol gestorneerd!');
        await transactionOverviewPage.clickButtonByLabel('Sluiten');
    });
    
    test('Verify reverse transaction when selecting reversal reason and modifying description', async () => {
        await transactionOverviewPage.clickButtonByUniqueCellValue('194250734', 'Storneren');
        await transactionOverviewPage.verifyHeadingDialog('Storneer transactie');
        await transactionOverviewPage.verifyContentDialog('Weet u zeker dat u transactie no 194250734 wilt storneren?');
        await transactionOverviewPage.selectDropdownOptionByLabel('Storno reden', 'Correctie gemaakt n.a.v. klacht IM');
        await transactionOverviewPage.inputTextareaByLabel('Omschrijving', 'Update description');
        await transactionOverviewPage.clickButtonByLabel('Opslaan');
        await transactionOverviewPage.verifyHeadingDialog('Transactie gestorneerd');
        await transactionOverviewPage.verifyContentDialog('Transactie no 194250734 is succesvol gestorneerd!');
        await transactionOverviewPage.clickButtonByLabel('Sluiten');
    });
})