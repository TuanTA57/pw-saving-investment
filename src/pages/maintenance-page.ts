import { Page } from '@playwright/test';
import { CommonPage } from './common-page';

export class MaintenancePage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }
}