import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Verification', () => {

  test('Admin Login and Data Loading', async ({ page }) => {
    // Navigate to admin
    await page.goto('http://localhost:3000/admin');
    
    // Fill credentials
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');

    // Wait for the dashboard to load by checking for the Logout button
    await page.waitForSelector('text=Logout');
    await page.waitForTimeout(1000); // Wait for stats to load

    // Screenshot Analytics Tab
    await page.screenshot({ path: 'playwright-report/admin-analytics.png', fullPage: true });

    // Click Users Tab
    await page.click('text="users"');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'playwright-report/admin-users.png', fullPage: true });

    // Click Jobs Tab
    await page.click('text="jobs"');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'playwright-report/admin-jobs.png', fullPage: true });

    // Click Subscriptions Tab
    await page.click('text="subscriptions"');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'playwright-report/admin-subscriptions.png', fullPage: true });

    // Verify successful load
    const logoutBtn = await page.locator('text=Logout').count();
    expect(logoutBtn).toBeGreaterThan(0);
  });

});
