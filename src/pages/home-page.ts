import { expect, Page } from '@playwright/test';
import { CommonPage } from './common-page';

export class HomePage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async onPage() {
        await expect(this.page.locator('.topicus-logo-text')).toBeVisible();
    }
}