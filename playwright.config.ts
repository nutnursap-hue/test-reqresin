/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.TEST_ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`), override: true });
console.log(`Loaded .env.${env} file`);

export default defineConfig({
  testDir: 'src/tests',
  timeout: 1_200_000,
  // Increased to handle Cloudflare challenge redirects
  expect: { timeout: 30_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,

  use: {
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Uses installed system Chrome — real binary = more realistic fingerprint
        channel: 'chrome',
      },
    },
  ],

  reporter: [['html', { open: 'on-failure' }]],
});