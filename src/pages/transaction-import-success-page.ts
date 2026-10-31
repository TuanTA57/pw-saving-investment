import { Page } from '@playwright/test';
import { CommonPage } from './common-page';
import { TFunction } from 'i18next';

export class TransactionImportSuccessPage extends CommonPage {
    constructor(page: Page, t: TFunction) {
        super(page, t);
    }
    async onPage() {
        await this.verifyPageHeading('De opdracht is succesvol');
    }
}