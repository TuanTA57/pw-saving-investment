import { expect, Page } from '@playwright/test';

export function sortJson(value: any): any {
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

export async function getExpansionDataByLabel(label: string, expectedHeaders: string[], page: Page) {
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
        for (let actualHeaderObj of actualHeaderMapping) {
            let cellXpath = `//mat-cell[${actualHeaderObj.actualIndex + 1}]`;
            let cellValue = (await row.locator(cellXpath).textContent())?.trim();
            rowDataObj[actualHeaderObj.key] = cellValue;
        }
        data.push(rowDataObj);
    }
    return data;
}

export async function viewDetailsByUniqueCellValue(cellValue: string, page: Page) {
    let rowXpath = `//mat-row[@role='row' and .//mat-cell[normalize-space()='${cellValue}']]`;
    await page.locator(rowXpath).click();
}

export async function clickButtonByUniqueCellValue(cellValue: string, buttonDescription: string, page: Page) {
    let rowXpath = `//mat-row[@role='row' and .//mat-cell[normalize-space()='${cellValue}']]`;
    clickButtonByDescription(buttonDescription, page);
}

export async function verifyHeadingDialog(heading: string, page: Page) {
    let headingDialogXpath = `//h2[contains(concat(' ', @class, ' '), ' mat-mdc-dialog-title ')]`;
    await expect(page.locator(headingDialogXpath)).toHaveText(heading);
}

export async function verifyContentDialog(content: string, page: Page) {
    await expect(page.locator('mat-dialog-content')).toHaveText(content);
}

export async function clickButtonByDescription(description: string, page: Page) {
    await page.getByRole('button', { description: description }).click();
}

export async function verifyHeadingPage(heading: string | RegExp, page: Page) {
    let headingPageXpath = `//div[contains(concat(' ',@class, ' '), ' heading ')]//div[contains(concat(' ',@class, ' '), ' primary ')]`;
    await expect(page.locator(headingPageXpath)).toHaveText(heading);
}

export async function verifyHeadingModal(heading: string, page: Page) {
    let headingModalXpath = `//mat-dialog-container//div[contains(concat(' ', @class, ' '), ' heading ') and normalize-space()='${heading}']`;
    await expect(page.locator(headingModalXpath)).toBeVisible();
}

export async function selectTabByLabel(label: string, page: Page) {
    await page.getByRole('tab', { name: label }).click();
}

export async function selectMenuByLabel(mainMenu: string, menuItem: string, page: Page) {
    let mainMenuItemLocator = page.locator(`//mat-list-item[.//div[contains(concat(' ', @class, ' '), ' label ') and normalize-space()='${mainMenu}']]`);
    await mainMenuItemLocator.click();
    let menuItemLocator = page.locator(`//mat-list-item[.//div[contains(concat(' ', @class, ' '), ' label ') and normalize-space()='${menuItem}']]`);
    await menuItemLocator.click();
}

export async function selectDropdownOptionsByLabel(label: string, options: string[], page: Page) {
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


export async function selectDropdownOptionByLabel(label: string, option: string, page: Page) {
    let dropdownXpath = `(//label[normalize-space()='${label}']/following::mat-select[@role='combobox'])[1]`;
    let dropdownLocator = page.locator(dropdownXpath);
    await dropdownLocator.click();
    let searchLocator = page.getByPlaceholder(label);
    await searchLocator.fill(option, { force: true });
    let optionLocator = page.locator(`//mat-option[@role='option' and normalize-space()='${option}']`);
    await optionLocator.click();
}

export async function clickButtonByLabel(label: string, page: Page) {
    await page.getByRole('button', { name: label }).click();
}

export async function inputTextboxByLabel(label: string, input: string, page: Page) {
    let textboxXpath = `(//label[normalize-space()='${label}']/following::input)[1]`;
    await page.locator(textboxXpath).fill(input);
}

export async function login(username: string, password: string, page: Page) {
    await inputTextboxByLabel('User Account', username, page);
    await inputTextboxByLabel('Password', password, page);
    await clickButtonByLabel('Sign in', page);
}