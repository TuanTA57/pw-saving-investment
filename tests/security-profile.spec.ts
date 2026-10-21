import { test, expect, Page } from '@playwright/test';
import { selectDropdownOptionByLabel, clickButtonByLabel, login, selectMenuByLabel, verifyHeadingPage, selectTabByLabel, clickButtonByDescription, verifyHeadingModal, inputTextboxByLabel, verifyHeadingDialog, verifyContentDialog } from '../src/common';

test('Verify security profile successfully', async ({ page }) => {
    await page.goto('http://localhost:4200/login?from=%2Fhome');
    await selectDropdownOptionByLabel('Select Domain', 'epic-test-client - Native application', page);
    await clickButtonByLabel('Login', page);
    await login('Testautomatisering@able.eu', 'uCRwAtzz6tVezXrV', page);
    await expect(page.locator('.topicus-logo-text')).toBeVisible();
    await selectMenuByLabel('Adviseur', 'Onderhoud', page);
    await verifyHeadingPage('Onderhoud / Overzicht', page);
    await selectTabByLabel('Beveiligings profiel', page);
    await expect(page.getByText('Onderhoud / Beveiligings profiel')).toBeVisible();
    await clickButtonByDescription('beveiligings profiel toevoegen', page);
    await verifyHeadingModal('Beveiligingsprofiel', page);
    const description = `Tuan - ${new Date().getTime()}`;
    await inputTextboxByLabel('Omschrijving', description, page);
    await inputTextboxByLabel('Externe code', description, page);
    await clickButtonByDescription('Opslaan', page);
    await verifyHeadingDialog('Beveiligingsprofiel toegevoegd', page);
    await verifyContentDialog('Beveiligingsprofiel is succesvol toegevoegd', page);
    await clickButtonByLabel('Sluiten', page);
});