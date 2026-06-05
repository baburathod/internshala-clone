# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: verification.spec.ts >> End-to-End Visual Verification Suite >> Forgot Password - UI Layout
- Location: e2e\verification.spec.ts:46:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text("Reset via Email")').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('button:has-text("Reset via Email")').first()

```

```yaml
- region "Notifications Alt+T"
- navigation:
  - link:
    - /url: /
  - button "Internships":
    - link "Internships":
      - /url: /internship
  - button "Jobs":
    - link "Jobs":
      - /url: /job
  - button "Community":
    - link "Community":
      - /url: /community
  - button "Subscriptions":
    - link "Subscriptions":
      - /url: /subscriptions
  - img
  - textbox "Search..."
  - button "en-US":
    - img
    - text: en-US
  - button "Login"
- img
- heading "Forgot Password" [level=2]
- paragraph: Enter your email or phone to receive a temporary password.
- text: Email or Phone
- img
- textbox "Email or Phone":
  - /placeholder: name@example.com or +1234567890
- button "Send Temporary Password"
- link "Back to home":
  - /url: /
- contentinfo:
  - heading "Internship by places" [level=3]
  - paragraph: New York
  - paragraph: Los Angeles
  - paragraph: Chicago
  - paragraph: San Francisco
  - paragraph: Miami
  - paragraph: Seattle
  - heading "Company" [level=3]
  - link "About us":
    - /url: /about
  - link "Careers":
    - /url: /careers
  - link "Press":
    - /url: /news
  - link "News":
    - /url: /news
  - link "Media kit":
    - /url: /media-kit
  - link "Contact":
    - /url: /contact
  - heading "Resources" [level=3]
  - link "Blog":
    - /url: /blog
  - link "Newsletter":
    - /url: /news
  - link "Events":
    - /url: /events
  - link "Help center":
    - /url: /help-center
  - link "Tutorials":
    - /url: /help-center
  - link "Supports":
    - /url: /contact
  - heading "Solutions" [level=3]
  - link "Startups":
    - /url: /startups
  - link "Enterprise":
    - /url: /enterprise
  - link "Government":
    - /url: /government
  - link "SaaS":
    - /url: /saas
  - link "Marketplaces":
    - /url: /ecommerce
  - link "Ecommerce":
    - /url: /ecommerce
  - separator
  - heading "About us" [level=3]
  - link "Startups":
    - /url: /startups
  - link "Enterprise":
    - /url: /enterprise
  - heading "Team diary" [level=3]
  - link "Blog":
    - /url: /blog
  - heading "Legal" [level=3]
  - link "Terms and conditions":
    - /url: /terms
  - link "Privacy Policy":
    - /url: /privacy-policy
  - heading "Sitemap" [level=3]
  - link "Sitemap":
    - /url: /
  - paragraph: Get Android App
  - img
  - img
  - img
  - paragraph: © Copyright 2025. All Rights Reserved.
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- link "Next.js 15.5.19 (outdated) Webpack":
  - /url: https://nextjs.org/docs/messages/version-staleness
  - img
  - text: Next.js 15.5.19 (outdated) Webpack
- img
- dialog "Recoverable Error":
  - text: Recoverable Error
  - button "Copy Error Info":
    - img
  - link "Go to related documentation":
    - /url: https://nextjs.org/docs/messages/react-hydration-error
    - img
  - link "Learn more about enabling Node.js inspector for server code with Chrome DevTools":
    - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
    - img
  - paragraph: "Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:"
  - paragraph: "- A server/client branch `if (typeof window !== 'undefined')`. - Variable input such as `Date.now()` or `Math.random()` which changes each time it's called. - Date formatting in a user's locale which doesn't match the server. - External changing data without sending a snapshot of it along with the HTML. - Invalid HTML tag nesting. It can also happen if the client has a browser extension installed which messes with the HTML before React loaded."
  - paragraph:
    - text: "See more info here:"
    - link "https://nextjs.org/docs/messages/react-hydration-error":
      - /url: https://nextjs.org/docs/messages/react-hydration-error
  - button "complete Component Stack":
    - img
  - code: "... <App pageProps={{}} Component={function ForgotPassword} err={undefined} router={{sdc:{},sbc:{}, ...}}> <Provider store={{...}}> <AuthListener> <div className=\"bg-white\"> <Lt> <Navbar> <div className=\"relative z-50\"> <nav className=\"bg-white s...\"> <div className=\"max-w-7xl ...\"> <div className=\"flex justi...\"> <div> <div> <div className=\"hidden md:...\"> <div className=\"relative\"> <button onClick={function onClick} className=\"flex items...\"> <Globe> <span className=\"uppercase\"> + en-US - en-IN ... ... ... ..."
  - paragraph: Call Stack 12
  - button "Show 12 ignore-listed frame(s)":
    - text: Show 12 ignore-listed frame(s)
    - img
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
  - img
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('End-to-End Visual Verification Suite', () => {
  4  | 
  5  |   test('Authentication - Profile Avatar & Logout', async ({ page }) => {
  6  |     // Note: Automated Google Auth is blocked by Google in headless browsers.
  7  |     // This test ensures the UI framework expects the state when logged in via mock.
  8  |     await page.goto('http://localhost:3000');
  9  |     // Ensure homepage categories render
  10 |     await expect(page.locator('text=Big Brands').first()).toBeVisible();
  11 |     await expect(page.locator('text=Work From Home').first()).toBeVisible();
  12 |   });
  13 | 
  14 |   test('Jobs & Internships - API Data Rendering', async ({ page }) => {
  15 |     // Listen to Network API calls
  16 |     const [jobRequest] = await Promise.all([
  17 |       page.waitForResponse(res => res.url().includes('/api/job') && res.status() === 200),
  18 |       page.goto('http://localhost:3000/job')
  19 |     ]);
  20 |     const jobs = await jobRequest.json();
  21 |     expect(jobs.length).toBeGreaterThanOrEqual(0);
  22 | 
  23 |     const [internRequest] = await Promise.all([
  24 |       page.waitForResponse(res => res.url().includes('/api/internship') && res.status() === 200),
  25 |       page.goto('http://localhost:3000/internship')
  26 |     ]);
  27 |     const internships = await internRequest.json();
  28 |     expect(internships.length).toBeGreaterThanOrEqual(0);
  29 |   });
  30 | 
  31 |   test('Community - Post Rendering & Action UIs', async ({ page }) => {
  32 |     await page.goto('http://localhost:3000/community');
  33 |     await expect(page.locator('text=Friends').first()).toBeVisible();
  34 |     await expect(page.locator('text=Posts Today Limit').first()).toBeVisible();
  35 |     await expect(page.locator('button:has-text("Post")').first()).toBeVisible();
  36 |   });
  37 | 
  38 |   test('Subscriptions - Plan Tiers', async ({ page }) => {
  39 |     await page.goto('http://localhost:3000/subscriptions');
  40 |     await expect(page.locator('text=Free').first()).toBeVisible();
  41 |     await expect(page.locator('text=Bronze').first()).toBeVisible();
  42 |     await expect(page.locator('text=Silver').first()).toBeVisible();
  43 |     await expect(page.locator('text=Gold').first()).toBeVisible();
  44 |   });
  45 | 
  46 |   test('Forgot Password - UI Layout', async ({ page }) => {
  47 |     await page.goto('http://localhost:3000/forgot-password');
  48 |     await expect(page.locator('text=Forgot Password').first()).toBeVisible();
> 49 |     await expect(page.locator('button:has-text("Reset via Email")').first()).toBeVisible();
     |                                                                              ^ Error: expect(locator).toBeVisible() failed
  50 |   });
  51 | 
  52 |   test('Resume Builder - Layout Elements', async ({ page }) => {
  53 |     await page.goto('http://localhost:3000/resume-builder');
  54 |     await expect(page.locator('text=Personal Details').first()).toBeVisible();
  55 |     await expect(page.locator('button:has-text("Generate PDF")').first()).toBeVisible();
  56 |   });
  57 | 
  58 |   test('Admin Dashboard - Access Controls', async ({ page }) => {
  59 |     await page.goto('http://localhost:3000/adminlogin');
  60 |     await expect(page.locator('text=Admin Login').first()).toBeVisible();
  61 |     await expect(page.locator('input[type="password"]').first()).toBeVisible();
  62 |   });
  63 | 
  64 |   test('Static Footer Pages', async ({ page }) => {
  65 |     await page.goto('http://localhost:3000/help-center');
  66 |     await expect(page.locator('text=Help Center').first()).toBeVisible();
  67 |     
  68 |     await page.goto('http://localhost:3000/privacy-policy');
  69 |     await expect(page.locator('text=Privacy Policy').first()).toBeVisible();
  70 | 
  71 |     await page.goto('http://localhost:3000/media-kit');
  72 |     await expect(page.locator('text=Media Kit').first()).toBeVisible();
  73 |   });
  74 | 
  75 |   test('Login History Table', async ({ page }) => {
  76 |     await page.goto('http://localhost:3000/profile');
  77 |     await expect(page.locator('text=Login History').first()).toBeVisible();
  78 |     await expect(page.locator('text=Browser').first()).toBeVisible();
  79 |     await expect(page.locator('text=OS').first()).toBeVisible();
  80 |   });
  81 | });
  82 | 
```