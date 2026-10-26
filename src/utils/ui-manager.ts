import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { MaintenancePage } from '../pages/maintenance-page';

export class UiManager {
    page: Page;
    loginPage: LoginPage;
    homePage: HomePage;
    maintenancePage: MaintenancePage;
    
    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.homePage = new HomePage(page);
        this.maintenancePage = new MaintenancePage(page);
    }
}