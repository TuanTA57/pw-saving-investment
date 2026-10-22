import { expect, Locator, Page } from '@playwright/test';

export class CommonPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async getExpansionTableDataByLabel(label: string, expectedHeaders: string[]) {
        let panelTitleXpath = `//mat-expansion-panel[.//mat-panel-title[normalize-space()='${label}']]`;
        return await this.getMatTableData(panelTitleXpath, expectedHeaders);
    }

    async getCardTableDataByLabel(label: string, expectedHeaders: string[]) {
        let cardTitleXpath = `//mat-card[.//mat-card-title[normalize-space()='${label}']]`;
        return await this.getMatTableData(cardTitleXpath, expectedHeaders);
    }

    async getMatTableData(rootXpath: 'root' | string, expectedHeaders: string[]) {
        let xpath = rootXpath == 'root' ? ":root" : rootXpath;
        let rootLocator = this.page.locator(xpath);
        let tableLocator = rootLocator.locator('mat-table');
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

    async getRowLocatorByUniqueCellValue(cellValue: string) {
        let rowXpath = `//mat-row[@role='row' and .//mat-cell[normalize-space()='${cellValue}']]`;
        return this.page.locator(rowXpath);
    }

    async viewDetailsByUniqueCellValue(cellValue: string) {
        let rowLocator = await this.getRowLocatorByUniqueCellValue(cellValue);
        await rowLocator.click();
    }

    async clickButtonByUniqueCellValue(cellValue: string, buttonDescription: string) {
        let rowLocator = await this.getRowLocatorByUniqueCellValue(cellValue);
        await rowLocator.getByRole('button', { description: buttonDescription }).click();
    }

    async verifyHeadingDialog(heading: string) {
        let headingDialogXpath = `//h2[contains(concat(' ', @class, ' '), ' mat-mdc-dialog-title ')]`;
        await expect(this.page.locator(headingDialogXpath)).toHaveText(heading);
    }

    async verifyContentDialog(content: string) {
        let contentDialogXpath = `//mat-dialog-content//p`;
        await expect(this.page.locator(contentDialogXpath)).toHaveText(content);
    }

    async clickButtonByDescription(description: string) {
        await this.page.getByRole('button', { description: description }).click();
    }

    async verifyHeadingPage(heading: string | RegExp) {
        let headingPageXpath = `//div[contains(concat(' ',@class, ' '), ' heading ')]//div[contains(concat(' ',@class, ' '), ' primary ')]`;
        await expect(this.page.locator(headingPageXpath)).toHaveText(heading);
    }

    async verifyHeadingModal(heading: string) {
        let headingModalXpath = `//mat-dialog-container//div[contains(concat(' ', @class, ' '), ' heading ') and normalize-space()='${heading}']`;
        await expect(this.page.locator(headingModalXpath)).toBeVisible();
    }

    async selectTabByLabel(label: string) {
        await this.page.getByRole('tab', { name: label }).click();
    }

    async selectMenuByLabel(mainMenu: string, menuItem: string) {
        let mainMenuItemLocator = this.page.locator(`//mat-list-item[.//div[contains(concat(' ', @class, ' '), ' label ') and normalize-space()='${mainMenu}']]`);
        await mainMenuItemLocator.click();
        let menuItemLocator = this.page.locator(`//mat-list-item[.//div[contains(concat(' ', @class, ' '), ' label ') and normalize-space()='${menuItem}']]`);
        await menuItemLocator.click();
    }

    async selectDropdownOptionsByLabel(label: string, options: string[]) {
        let dropdownXpath = `(//label[normalize-space()='${label}']/following::mat-select[@role='combobox'])[1]`;
        let dropdownLocator = this.page.locator(dropdownXpath);
        await dropdownLocator.click();
        for (let option of options) {
            let searchLocator = this.page.getByPlaceholder(label);
            await searchLocator.clear({ force: true });
            await searchLocator.fill(option, { force: true });
            let optionLocator = this.page.locator(`//mat-option[@role='option' and normalize-space()='${option}']`);
            await optionLocator.click();
        }
        await this.page.keyboard.press('Tab');
    }

    async selectDropdownOptionByLabel(label: string, option: string) {
        let dropdownXpath = `(//label[normalize-space()='${label}']/following::mat-select[@role='combobox'])[1]`;
        let dropdownLocator = this.page.locator(dropdownXpath);
        await dropdownLocator.click();
        let searchLocator = this.page.getByPlaceholder(label);
        await searchLocator.fill(option, { force: true });
        let optionLocator = this.page.locator(`//mat-option[@role='option' and normalize-space()='${option}']`);
        await optionLocator.click();
    }

    async clickButtonByLabel(label: string) {
        await this.page.getByRole('button', { name: label }).click();
    }

    async inputTextboxByLabel(label: string, input: string) {
        let textboxXpath = `(//label[normalize-space()='${label}']/following::input)[1]`;
        await this.page.locator(textboxXpath).fill(input);
    }

    async inputTextareaByLabel(label: string, input: string) {
        let textareaXpath = `(//label[normalize-space()='${label}']//following::textarea)[1]`;
        await this.page.locator(textareaXpath).fill(input);
    }
}