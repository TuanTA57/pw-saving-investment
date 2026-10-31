import { Page } from '@playwright/test';
import { CommonPage } from './common-page';
import { TFunction } from 'i18next';

export class CorporateActionsJobsPage extends CommonPage {
    constructor(page: Page, t: TFunction) {
        super(page, t);
    }
    async onPage() {
        await this.verifyPageHeading('Jobs');
    }
}