import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Verification', () => {

  test('Admin Login and Data Loading', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    
    // Check if we hit the login screen
    const isLogin = await page.isVisible('text=Admin Login');
    if (isLogin) {
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'admin');
      await page.click('button[type="submit"]', { force: true });
      
      // Wait for the dashboard to load by checking for the Logout button
      await page.waitForSelector('text=Logout');
    }

    await page.waitForTimeout(1000); // Wait for data to fetch
    await page.screenshot({ path: 'playwright-report/admin-dashboard.png', fullPage: true });

    // Click on Jobs tab
    await page.click('button:has-text("Jobs")', { force: true });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'playwright-report/admin-jobs.png', fullPage: true });

    // Click on Internships tab
    await page.click('button:has-text("Internships")', { force: true });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'playwright-report/admin-internships.png', fullPage: true });

    // Verify some text
    const textCount = await page.locator('text=Admin Dashboard').count();
    expect(textCount).toBeGreaterThan(0);
  });

});
