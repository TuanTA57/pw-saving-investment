import { Page } from '@playwright/test';
import { CommonPage } from './common-page';

export class TransactionImportPage extends CommonPage{
    constructor(page: Page) {
        super(page);
    }
    async onPage() {
        await this.verifyPageHeading('Importeren');
    }
}