import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { MaintenancePage } from '../pages/maintenance-page';
import { TransactionOverviewPage } from '../pages/transaction-overview-page';
import { corporateActionsJobsPage } from '../pages/corporate-actions-jobs-page';

export class UiManager {
    page: Page;
    loginPage: LoginPage;
    homePage: HomePage;
    maintenancePage: MaintenancePage;
    transactionOverviewPage: TransactionOverviewPage;
    corporateActionsJobsPage: corporateActionsJobsPage;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.homePage = new HomePage(page);
        this.maintenancePage = new MaintenancePage(page);
        this.transactionOverviewPage = new TransactionOverviewPage(page);
        this.corporateActionsJobsPage = new corporateActionsJobsPage(page);
    }
}