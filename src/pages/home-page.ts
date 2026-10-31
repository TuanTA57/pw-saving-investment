import { expect, Page } from '@playwright/test';
import { CommonPage } from './common-page';
import { TFunction } from 'i18next';

export class HomePage extends CommonPage {
    constructor(page: Page, t: TFunction) {
            super(page, t);
        }

    async onPage() {
        await expect(this.page.locator('.topicus-logo-text')).toBeVisible();
    }
}