import { Page } from '@playwright/test';
import { BASE_URL } from '../utils/constant-utils';

export class ApiUtils {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async deleteArchiveProfile(entity: any) {
        let url = `${BASE_URL}/advisor/archiveprofile/${encodeURIComponent(JSON.stringify(entity))}`;
        let deleteArchiveProfileBody = {
            archiveProfile: entity
        };

        const token = await this.page.sessionStorage.getItem('accessToken');
        await this.page.evaluate(async ({ url, body, token }) => {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/vnd.+json,application/vnd.v2+json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(body)
            });
            return response.status;
        }, { url, body: deleteArchiveProfileBody, token });
    }

}