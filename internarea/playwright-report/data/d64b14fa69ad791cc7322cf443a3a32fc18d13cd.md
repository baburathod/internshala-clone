# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin_verification.spec.ts >> Admin Dashboard Verification >> Admin Login and Data Loading
- Location: e2e\admin_verification.spec.ts:5:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/admin
Call log:
  - navigating to "http://localhost:3000/admin", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Dashboard Verification', () => {
  4  | 
  5  |   test('Admin Login and Data Loading', async ({ page }) => {
  6  |     // Navigate to admin
> 7  |     await page.goto('http://localhost:3000/admin');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/admin
  8  |     
  9  |     // Fill credentials
  10 |     await page.fill('input[type="text"]', 'admin');
  11 |     await page.fill('input[type="password"]', 'admin');
  12 |     await page.click('button[type="submit"]');
  13 | 
  14 |     // Wait for the dashboard to load by checking for the Logout button
  15 |     await page.waitForSelector('text=Logout');
  16 |     await page.waitForTimeout(1000); // Wait for stats to load
  17 | 
  18 |     // Screenshot Analytics Tab
  19 |     await page.screenshot({ path: 'playwright-report/admin-analytics.png', fullPage: true });
  20 | 
  21 |     // Click Users Tab
  22 |     await page.click('text="users"');
  23 |     await page.waitForTimeout(500);
  24 |     await page.screenshot({ path: 'playwright-report/admin-users.png', fullPage: true });
  25 | 
  26 |     // Click Jobs Tab
  27 |     await page.click('text="jobs"');
  28 |     await page.waitForTimeout(500);
  29 |     await page.screenshot({ path: 'playwright-report/admin-jobs.png', fullPage: true });
  30 | 
  31 |     // Click Subscriptions Tab
  32 |     await page.click('text="subscriptions"');
  33 |     await page.waitForTimeout(500);
  34 |     await page.screenshot({ path: 'playwright-report/admin-subscriptions.png', fullPage: true });
  35 | 
  36 |     // Verify successful load
  37 |     const logoutBtn = await page.locator('text=Logout').count();
  38 |     expect(logoutBtn).toBeGreaterThan(0);
  39 |   });
  40 | 
  41 | });
  42 | 
```