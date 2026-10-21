import { test, expect, Page } from '@playwright/test';
import { selectDropdownOptionByLabel, clickButtonByLabel, login, selectMenuByLabel, verifyHeadingPage, selectTabByLabel, clickButtonByDescription, verifyHeadingModal, inputTextboxByLabel, selectDropdownOptionsByLabel, verifyHeadingDialog, verifyContentDialog, viewDetailsByUniqueCellValue, getExpansionDataByLabel, sortJson } from '../src/common';

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