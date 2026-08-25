import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 800 } });

test('tapping the hamburger reveals the nav menu over the page', async ({ page }) => {
  await page.goto('./');

  const hamburger = page.locator('.hamburger-label');
  const navMenu = page.locator('.nav-menu');
  const homeLink = page.locator('.nav-menu a', { hasText: 'Home' });

  await expect(hamburger).toBeVisible();
  await hamburger.click();

  // The menu should open right under the header, inside the viewport -
  // not get pushed off-screen somewhere down the page.
  await expect(navMenu).toBeInViewport();
  await expect(homeLink).toBeInViewport();
});
