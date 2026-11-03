import { expect } from '@playwright/test';
import { sortJson } from '../src/utils/json-utils';
import { adminTest } from '../src/fixtures/admin-fixture';
import { BASE_URL } from '../src/utils/constant-utils';

adminTest.setTimeout(90_000);

adminTest('Verify archive profile successfully', async ({ page, ui, t, api }) => {

    await ui.homePage.selectMenuByLabel(t('menu.advisor'), t('menu.maintenance'));

    await ui.maintenancePage.onPage();
    await ui.maintenancePage.selectTabByLabel('Archief profiel');
    await expect(page.getByText('Onderhoud / Archief profiel')).toBeVisible();

    await ui.maintenancePage.clickButtonByDescription('Archief profiel toevoegen');
    await ui.maintenancePage.verifyModalHeading('Archief profiel');
    const description = `Tuan - ${new Date().getTime()}`;
    await ui.maintenancePage.inputTextboxByLabel('Omschrijving', description);
    await ui.maintenancePage.inputTextboxByLabel('Externe code', '1234');
    let documentTypes = ['AFAT - Afloop AT controle proces', 'ANAV - Aanmelding AVA'];
    await ui.maintenancePage.selectDropdownOptionsByLabel('Document type', documentTypes);

    const createArchiveProfileResponsePromise = ui.maintenancePage.listenToCreateArchiveProfileResponse();

    await ui.maintenancePage.clickButtonByDescription('Opslaan');

    const entity = ui.maintenancePage.getArchiveProfileEntity(createArchiveProfileResponsePromise);

    await ui.maintenancePage.verifyDialogHeading('Archief profiel toegevoegd');
    await ui.maintenancePage.verifyDialogContent('Archief profiel succesvol toegevoegd');
    await ui.maintenancePage.clickButtonByLabel('Sluiten');
    await ui.maintenancePage.clickRowByUniqueCellValue(description);
    await ui.maintenancePage.verifyPageHeading(/^Onderhoud *\/ *Archief profiel (\d+) *\/ *Details$/);
    const expectedDescriptionRegex = new RegExp(`Omschrijving\\s*${description}`);
    await expect(page.getByText(expectedDescriptionRegex)).toBeVisible();
    await expect(page.getByText('Externe code  1234')).toBeVisible();
    const actualDocumentTypeValues = await ui.maintenancePage.getExpansionTableDataByLabel('Document types', ['Type']);
    let expectedDocumentTypes = documentTypes.map(value => {
        return { Type: value }
    });
    expect(actualDocumentTypeValues.length).toEqual(documentTypes.length);
    expect(sortJson(actualDocumentTypeValues)).toEqual(expect.arrayContaining(sortJson(expectedDocumentTypes)));

    await api.deleteArchiveProfile(entity);
});

adminTest('Edit profile', async ({ page, ui, t, api }) => {
    const createArchiveProfileResponsePromise = ui.maintenancePage.listenToCreateArchiveProfileResponse();

    const name = `Tuan - ${new Date().getTime()}`;
    let archiveProfileBody = {
        "archiveProfile": {
            "name": name,
            "documentType": [
                {
                    "documentType": "AFAT"
                },
                {
                    "documentType": "ANAV"
                }
            ],
            "externalCode": "1234"
        }
    }
    let url = `${BASE_URL}/advisor/archiveprofile`;

    const token = await page.sessionStorage.getItem('accessToken');
    await page.evaluate(async ({ url, body, token }) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.+json,application/vnd.v2+json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(body)
        });
        return response.status;
    }, { url, body: archiveProfileBody, token });

    const entity = ui.maintenancePage.getArchiveProfileEntity(createArchiveProfileResponsePromise);

    await ui.homePage.selectMenuByLabel(t('menu.advisor'), t('menu.maintenance'));
    await ui.maintenancePage.onPage();
    await ui.maintenancePage.selectTabByLabel('Archief profiel');
    await expect(page.getByText('Onderhoud / Archief profiel')).toBeVisible();
    await ui.maintenancePage.clickButtonByUniqueCellValue(name, 'Muteren');
    await ui.maintenancePage.verifyModalHeading(/^Archief profiel (\d+)$/);

    const description = `Update - ${new Date().getTime()}`;
    await ui.maintenancePage.inputTextboxByLabel('Omschrijving', description);
    await ui.maintenancePage.inputTextboxByLabel('Externe code', '3456');
    let documentTypes = ['ATFM - Transfer rapport'];
    await ui.maintenancePage.selectDropdownOptionsByLabel('Document type', documentTypes);

    await ui.maintenancePage.clickButtonByDescription('Opslaan');

    await ui.maintenancePage.verifyDialogHeading('Archief profiel aangepast');
    await ui.maintenancePage.verifyDialogContent('Archief profiel succesvol aangepast');
    await ui.maintenancePage.clickButtonByLabel('Sluiten');
    await ui.maintenancePage.clickRowByUniqueCellValue(description);
    await ui.maintenancePage.verifyPageHeading(/^Onderhoud *\/ *Archief profiel (\d+) *\/ *Details$/);
    const expectedDescriptionRegex = new RegExp(`Omschrijving\\s*${description}`);
    await expect(page.getByText(expectedDescriptionRegex)).toBeVisible();
    await expect(page.getByText('Externe code  3456')).toBeVisible();
    let expectedDocumentTypeValues = ['AFAT - Afloop AT controle proces', 'ANAV - Aanmelding AVA', 'ATFM - Transfer rapport'];
    const actualDocumentTypeValues = await ui.maintenancePage.getExpansionTableDataByLabel('Document types', ['Type']);
    let expectedDocumentTypes = expectedDocumentTypeValues.map(value => {
        return { Type: value }
    });
    expect(actualDocumentTypeValues.length).toEqual(documentTypes.length);
    expect(sortJson(actualDocumentTypeValues)).toEqual(expect.arrayContaining(sortJson(expectedDocumentTypes)));

    await api.deleteArchiveProfile(entity);
});