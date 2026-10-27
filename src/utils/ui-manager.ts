import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { MaintenancePage } from '../pages/maintenance-page';
import { TransactionOverviewPage } from '../pages/transaction-overview-page';

export class UiManager {
    page: Page;
    loginPage: LoginPage;
    homePage: HomePage;
    maintenancePage: MaintenancePage;
    transactionOverviewPage: TransactionOverviewPage;
    
    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.homePage = new HomePage(page);
        this.maintenancePage = new MaintenancePage(page);
        this.transactionOverviewPage = new TransactionOverviewPage(page);
    }
}