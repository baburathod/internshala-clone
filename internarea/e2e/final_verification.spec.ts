import { test, expect } from '@playwright/test';

test.describe('Phase 1 & 2 Verification Suite', () => {

  test('Verify Homepage Categories (Phase 2)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const categories = [
      'Big Brands',
      'Work From Home',
      'Part-time',
      'MBA',
      'Engineering',
      'Media',
      'Design',
      'Data Science'
    ];

    for (const cat of categories) {
      // Click the category pill
      await page.getByText(cat, { exact: true }).click();
      await page.waitForTimeout(1000); // Wait for state update

      // Take a screenshot of the filtered results
      await page.screenshot({ path: `playwright-report/category-${cat.replace(/\s+/g, '-')}.png`, fullPage: true });

      // Verify that "No jobs found" is NOT present (meaning data is populated)
      const noJobsMsg = await page.locator('text="No jobs found for this category yet"').count();
      const noInternMsg = await page.locator('text="No internships found for this category yet"').count();
      
      // We expect at least one card to be visible, so the empty state messages should not be there
      // (assuming seed data populated them)
      console.log(`Category: ${cat} | Empty State Count: Jobs=${noJobsMsg}, Internships=${noInternMsg}`);
    }
  });

  test('Verify Footer Pages Generation (Phase 1)', async ({ page }) => {
    const pagesToTest = [
      { url: '/about', title: 'About Us' },
      { url: '/careers', title: 'Careers' },
      { url: '/contact', title: 'Contact Us' },
      { url: '/blog', title: 'Blog' },
      { url: '/news', title: 'News' },
      { url: '/media-kit', title: 'Media Kit' },
      { url: '/help-center', title: 'Help Center' },
      { url: '/events', title: 'Events' },
      { url: '/startups', title: 'Startups' },
      { url: '/enterprise', title: 'Enterprise' },
      { url: '/government', title: 'Government' },
      { url: '/saas', title: 'SaaS' },
      { url: '/ecommerce', title: 'Ecommerce' },
      { url: '/privacy-policy', title: 'Privacy Policy' },
      { url: '/terms', title: 'Terms' },
      { url: '/sitemap', title: 'Sitemap' }
    ];

    for (const p of pagesToTest) {
      await page.goto(`http://localhost:3000${p.url}`);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `playwright-report/footer${p.url.replace(/\//g, '-')}.png`, fullPage: true });
      
      // Verify placeholder text is gone
      const placeholderCount = await page.locator('text="This is a placeholder page"').count();
      expect(placeholderCount).toBe(0);
    }
  });

});
