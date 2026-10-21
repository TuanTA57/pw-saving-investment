import { Page } from '@playwright/test';
import { CommonPage } from './common-page';

export class LoginPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string) {
        await this.inputTextboxByLabel('User Account', username);
        await this.inputTextboxByLabel('Password', password);
        await this.clickButtonByLabel('Sign in');
    }
}