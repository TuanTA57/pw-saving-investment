import { Page, Response } from '@playwright/test';
import { CommonPage } from './common-page';
import { TFunction } from 'i18next';

export class MaintenancePage extends CommonPage {
    constructor(page: Page, t: TFunction) {
        super(page, t);
    }

    async onPage() {
        await this.verifyPageHeading('Onderhoud / Overzicht');
    }

    listenToCreateArchiveProfileResponse() {
        return this.page.waitForResponse('**/advisor/archiveprofile');
    }

    async getArchiveProfileEntity(createArchiveProfileResponsePromise: Promise<Response>) {
        const createArchiveProfileResponse = await createArchiveProfileResponsePromise;
        const createArchiveProfileResponseBody = await createArchiveProfileResponse.json();
        return createArchiveProfileResponseBody.archiveProfile.find((v: { entity: string }) => v.entity === 'NL');
    }
}