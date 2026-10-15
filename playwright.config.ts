import { defineConfig, devices } from '@playwright/test';

// Pruebas de punta a punta (QA-02, A11Y). Localmente usan el Google Chrome instalado;
// en CI, el Chromium de Playwright (npx playwright install chromium).
const channel = process.env.CI ? undefined : 'chrome';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // cada página anima el canvas del hero: con muchos navegadores a la vez la máquina se satura
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel } },
  ],
  webServer: {
    command: 'npm run build && npx next start -p 3100',
    url: 'http://localhost:3100/es',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
