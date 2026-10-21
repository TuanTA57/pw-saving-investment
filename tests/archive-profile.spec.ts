import { test, expect, Page } from '@playwright/test';

test('Verify archive profile successfully', async ({ page }) => {
    await page.goto('http://localhost:4200/login?from=%2Fhome');
    await selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application', page);
    await clickButtonByLabel('Login', page);
    await login('Testautomatisering@able.eu', 'uCRwAtzz6tVezXrV', page);
    await expect(page.locator('.topicus-logo-text')).toBeVisible();
    await selectMenuByLabel('Adviseur', 'Onderhoud', page);
    await verifyHeadingPage('Onderhoud / Overzicht', page);
    await selectTabByLabel('Archief profiel', page);
    await expect(page.getByText('Onderhoud / Archief profiel')).toBeVisible();
    await clickButtonByDescription('Archief profiel toevoegen', page);
    await verifyHeadingModal('Archief profiel', page);
    const description = `Tuan - ${new Date().getTime()}`;
    await inputTextboxByLabel('Omschrijving', description, page);
    await inputTextboxByLabel('Externe code', '1234', page);
    let docmumentTypes = ['AFAT - Afloop AT Controle Proces', 'ANAV - Aanmelding AVA'];
    await selectDropdownOptionsByLabel('Document type', docmumentTypes, page);
    await clickButtonByDescription('Opslaan', page);
    await verifyHeadingDialog('Archief profiel toegevoegd', page);
    await verifyContentDialog('Archief profiel succesvol toegevoegd', page);
    await clickButtonByLabel('Sluiten', page);
    await viewDetailsByUniqueCellValue(description, page);
    await verifyHeadingPage(/^Onderhoud *\/ *Archief profiel (\d+) *\/ *Details$/, page);
    const expectedDescriptionRegex = new RegExp(`Omschrijving\\s*${description}`);
    await expect(page.getByText(expectedDescriptionRegex)).toBeVisible();
    await expect(page.getByText('Externe code  1234')).toBeVisible();
    const actualDocumentTypeValues = await getExpansionDataByLabel('Document types', ['Type'], page);
    let expectedDocumentTypes = docmumentTypes.map( value => {
        return { Type: value}
    });
    expect(actualDocumentTypeValues.length).toEqual(docmumentTypes.length);
    expect(sortJson(actualDocumentTypeValues)).toEqual(expect.arrayContaining(sortJson(expectedDocumentTypes)));
});

function sortJson(value: any): any {
    // Array → sort values
    if (Array.isArray(value)) {
        return value
            .map(sortJson)
            .sort((a, b) => {
                return JSON.stringify(a).localeCompare(JSON.stringify(b));
            });
    }
    // Object → sort keys
    if (value !== null && typeof value === "object") {
        const sorted: { [key: string]: any } = {};
        Object.keys(value)
            .sort()
            .forEach(key => {
                sorted[key] = sortJson(value[key]);
            });
        return sorted;
    }
    return value;
}

async function getExpansionDataByLabel(label: string, expectedHeaders: string[], page: Page) {
    let panelTitleXpath = `//mat-expansion-panel[.//mat-panel-title[normalize-space()='${label}']]`;
    let panelTitleLocator = page.locator(panelTitleXpath);
    let tableLocator = panelTitleLocator.locator('mat-table');
    let rawActualHeaders = await tableLocator.locator('mat-header-cell').allTextContents();
    let actualHeaders = rawActualHeaders.map(header => header.trim());
    let actualHeaderMapping = [];
    let data = [];
    for (let i = 0; i < expectedHeaders.length; i++) {
        let actualIndex = actualHeaders.indexOf(expectedHeaders[i]);
        let actualHeaderObj = {
            key: expectedHeaders[i],
            actualIndex: actualIndex
        }
        actualHeaderMapping.push(actualHeaderObj);
    }
    let rows = await tableLocator.locator('mat-row').all();
    for (let row of rows) {
        let rowDataObj: any = {};
        for(let actualHeaderObj of actualHeaderMapping) {
            let cellXpath = `//mat-cell[${actualHeaderObj.actualIndex + 1}]`;
            let cellValue = (await row.locator(cellXpath).textContent())?.trim();
            rowDataObj[actualHeaderObj.key] = cellValue;
        }
        data.push(rowDataObj);
    }
    return data;
}

async function viewDetailsByUniqueCellValue(cellValue: string, page: Page) {
    let rowXpath = `//mat-row[@role='row' and .//mat-cell[normalize-space()='${cellValue}']]`;
    await page.locator(rowXpath).click();
}

async function clickButtonByUniqueCellValue(cellValue: string, buttonDescription: string, page: Page) {
    let rowXpath = `//mat-row[@role='row' and .//mat-cell[normalize-space()='${cellValue}']]`;
    clickButtonByDescription(buttonDescription, page);
}

async function verifyHeadingDialog(heading: string, page: Page) {
    let headingDialogXpath = `//h2[contains(concat(' ', @class, ' '), ' mat-mdc-dialog-title ')]`;
    await expect(page.locator(headingDialogXpath)).toHaveText(heading);
}

async function verifyContentDialog(content: string, page: Page) {
    await expect(page.locator('mat-dialog-content')).toHaveText(content);
}

async function clickButtonByDescription(description: string, page: Page) {
    await page.getByRole('button', { description: description }).click();
}

async function verifyHeadingPage(heading: string | RegExp, page: Page) {
    let headingPageXpath = `//div[contains(concat(' ',@class, ' '), ' heading ')]//div[contains(concat(' ',@class, ' '), ' primary ')]`;
    await expect(page.locator(headingPageXpath)).toHaveText(heading);
}

async function verifyHeadingModal(heading: string, page: Page) {
    let headingModalXpath = `//mat-dialog-container//div[contains(concat(' ', @class, ' '), ' heading ') and normalize-space()='${heading}']`;
    await expect(page.locator(headingModalXpath)).toBeVisible();
}

async function selectTabByLabel(label: string, page: Page) {
    await page.getByRole('tab', { name: label }).click();
}

async function selectMenuByLabel(mainMenu: string, menuItem: string, page: Page) {
    let mainMenuItemLocator = page.locator(`//mat-list-item[.//div[contains(concat(' ', @class, ' '), ' label ') and normalize-space()='${mainMenu}']]`);
    await mainMenuItemLocator.click();
    let menuItemLocator = page.locator(`//mat-list-item[.//div[contains(concat(' ', @class, ' '), ' label ') and normalize-space()='${menuItem}']]`);
    await menuItemLocator.click();
}

async function selectDropdownOptionsByLabel(label: string, options: string[], page: Page) {
    let dropdownXpath = `(//label[normalize-space()='${label}']/following::mat-select[@role='combobox'])[1]`;
    let dropdownLocator = page.locator(dropdownXpath);
    await dropdownLocator.click();
    for (let option of options) {
        let searchLocator = page.getByPlaceholder(label);
        await searchLocator.clear({ force: true });
        await searchLocator.fill(option, { force: true });
        let optionLocator = page.locator(`//mat-option[@role='option' and normalize-space()='${option}']`);
        await optionLocator.click();
    }
    await page.keyboard.press('Tab');
}


async function selectDropdownOptionByLabel(label: string, option: string, page: Page) {
    let dropdownXpath = `(//label[normalize-space()='${label}']/following::mat-select[@role='combobox'])[1]`;
    let dropdownLocator = page.locator(dropdownXpath);
    await dropdownLocator.click();
    let searchLocator = page.getByPlaceholder(label);
    await searchLocator.fill(option, { force: true });
    let optionLocator = page.locator(`//mat-option[@role='option' and normalize-space()='${option}']`);
    await optionLocator.click();
}

async function clickButtonByLabel(label: string, page: Page) {
    await page.getByRole('button', { name: label }).click();
}

async function inputTextboxByLabel(label: string, input: string, page: Page) {
    let textboxXpath = `(//label[normalize-space()='${label}']/following::input)[1]`;
    await page.locator(textboxXpath).fill(input);
}

async function login(username: string, password: string, page: Page) {
    await inputTextboxByLabel('User Account', username, page);
    await inputTextboxByLabel('Password', password, page);
    await clickButtonByLabel('Sign in', page);
}