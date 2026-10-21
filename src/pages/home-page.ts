import { Page } from '@playwright/test';
import { CommonPage } from './common-page';

export class HomePage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }
}