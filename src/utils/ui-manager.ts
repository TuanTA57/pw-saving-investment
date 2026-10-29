import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { MaintenancePage } from '../pages/maintenance-page';
import { TransactionOverviewPage } from '../pages/transaction-overview-page';
import { CorporateActionsJobsPage } from '../pages/corporate-actions-jobs-page';
import { TransactionImportPage } from '../pages/transaction-import-page';
import { TransactionImportSuccessPage } from '../pages/transaction-import-success-page';
import { SettlementTraspasoDetailsPage } from '../pages/settlement-traspaso-details-page';
import { SettlementTraspasoMonitorPage } from '../pages/settlement-traspaso-monitor-page copy';

export class UiManager {
    page: Page;
    loginPage: LoginPage;
    homePage: HomePage;
    maintenancePage: MaintenancePage;
    transactionOverviewPage: TransactionOverviewPage;
    transactionImportPage: TransactionImportPage;
    transactionImportSuccessPage: TransactionImportSuccessPage;
    corporateActionsJobsPage: CorporateActionsJobsPage;
    settlementTraspasoDetails: SettlementTraspasoDetailsPage;
    settlementTraspasoMonitor: SettlementTraspasoMonitorPage;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.homePage = new HomePage(page);
        this.maintenancePage = new MaintenancePage(page);
        this.transactionOverviewPage = new TransactionOverviewPage(page);
        this.transactionImportPage = new TransactionImportPage(page);
        this.corporateActionsJobsPage = new CorporateActionsJobsPage(page);
        this.transactionImportSuccessPage = new TransactionImportSuccessPage(page);
        this.settlementTraspasoDetails = new SettlementTraspasoDetailsPage(page);
        this.settlementTraspasoMonitor = new SettlementTraspasoMonitorPage(page);
    }
}