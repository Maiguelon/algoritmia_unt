import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', fullyParallel: false, workers: 1,
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:4321', reuseExistingServer: true, timeout: 60000 },
});
