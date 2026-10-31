import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

let currentEnv = process.env.TEST_ENV ?? 'staging';

dotenv.config({ path: path.resolve(__dirname, `env/.env.${currentEnv}`) });

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  retries: 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    testIdAttribute: 'data-test',
    launchOptions: {
      //disable angular animation
      // TODO: remove --disable-web-security later, added temporarily to bypass web security like manual `chrome.exe --disable-web-security`
      args: ['--disable-blink-features=LayoutInstabilityAPI', '--disable-web-security']
    }

  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'], 
        locale: "en"
      },
    }
  ],
});