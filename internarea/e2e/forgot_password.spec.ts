import { test, expect } from '@playwright/test';

test.describe('Forgot Password Verification', () => {

  test('Forgot Password Layout and Form', async ({ page }) => {
    await page.goto('http://localhost:3000/forgot-password');
    await page.waitForSelector('input[name="identifier"]');
    await page.waitForTimeout(1000); 
    await page.screenshot({ path: 'playwright-report/forgot-password-ui.png', fullPage: true });

    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.click('button[type="submit"]', { force: true });

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'playwright-report/forgot-password-submit.png', fullPage: true });
    
    const inputCount = await page.locator('input[name="identifier"]').count();
    expect(inputCount).toBeGreaterThan(0);
  });

});
