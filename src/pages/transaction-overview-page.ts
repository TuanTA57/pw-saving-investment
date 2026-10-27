import { Page } from '@playwright/test';
import { CommonPage } from './common-page';

export class TransactionOverviewPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }
    async onPage() {
        await this.verifyPageHeading('Transactie overzicht');
    }
}