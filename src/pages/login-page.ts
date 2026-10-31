import { expect, Page } from '@playwright/test';
import { CommonPage } from './common-page';
import { TFunction } from 'i18next';

export class LoginPage extends CommonPage {
    constructor(page: Page, t: TFunction) {
        super(page, t);
    }

    async login(username: string, password: string) {
        await this.inputTextboxByLabel(this.t("field.username"), username);
        await this.inputTextboxByLabel(this.t("field.password"), password);
        await this.clickButtonByLabel(this.t("button.login"));
    }

    async onPage() {
        await expect(this.page.getByText('Login to Akkuro')).toBeVisible(); 
    }
}