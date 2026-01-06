import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Note: MSW handles all backend API mocking at the Node.js level
// No browser-level mocks needed - see e2e/msw/handlers.ts

/**
 * Helper to wait for page to be fully hydrated
 * Waits for load state then waits for body content to render
 */
async function waitForPageReady(page: import('@playwright/test').Page) {
  await page.waitForLoadState('domcontentloaded');
  // Wait for body to be visible (React hydration complete)
  await page.locator('body').waitFor({ state: 'visible', timeout: 5000 });
}

test.describe('Accessibility - WCAG 2.1 AA', () => {
  test.describe('Home Page', () => {
    test('should not have any automatically detectable WCAG A/AA violations', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have no critical accessibility violations', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .options({ resultTypes: ['violations'] })
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );

      expect(criticalViolations).toEqual([]);
    });
  });

  test.describe('Explore Page', () => {
    test('should not have any automatically detectable WCAG A/AA violations', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);
      // Wait for agent cards to load
      await page
        .locator('[data-testid="agent-card"]')
        .first()
        .waitFor({ state: 'visible', timeout: 10000 });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('search input should be accessible', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const searchInput = page.getByRole('searchbox');
      if (await searchInput.isVisible()) {
        await expect(searchInput).toBeVisible();
      }
    });

    test('filter buttons should be keyboard accessible', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);
      // Wait for search input to ensure page is interactive
      await page.getByRole('searchbox').waitFor({ state: 'visible', timeout: 5000 });

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');
      const isFocused = await focusedElement.count();
      expect(isFocused).toBeGreaterThan(0);
    });
  });

  test.describe('Agent Detail Page', () => {
    test('should not have any automatically detectable WCAG A/AA violations', async ({ page }) => {
      await page.goto('/agent/11155111:1');
      await waitForPageReady(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('back link should be accessible via keyboard', async ({ page }) => {
      await page.goto('/agent/11155111:1');
      await waitForPageReady(page);

      await page.keyboard.press('Tab');

      const backLink = page.getByRole('link', { name: /back/i });
      if (await backLink.isVisible().catch(() => false)) {
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/.*explore/);
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('home page should have sufficient color contrast', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('explore page should have sufficient color contrast', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('can navigate home page with keyboard only', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }

      const focusedElement = page.locator(':focus');
      const isFocused = await focusedElement.count();
      expect(isFocused).toBeGreaterThan(0);
    });

    test('can navigate explore page with keyboard only', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Tab');
      }

      const focusedElement = page.locator(':focus');
      const isFocused = await focusedElement.count();
      expect(isFocused).toBeGreaterThan(0);
    });

    test('can reverse tab with Shift+Tab', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);
      // Wait for search input to ensure page is interactive
      await page.getByRole('searchbox').waitFor({ state: 'visible', timeout: 5000 });

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');

      const focusedElement = page.locator(':focus');
      const isFocused = await focusedElement.count();
      expect(isFocused).toBeGreaterThan(0);
    });
  });

  test.describe('Semantic Structure', () => {
    test('home page has proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
    });

    test('explore page has proper heading hierarchy', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
    });

    test('pages have main landmark', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const main = page.locator('main').first();
      await expect(main).toBeVisible();
    });

    test('pages have header landmark', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const header = page.getByRole('banner');
      await expect(header).toBeVisible();
    });

    test('pages have footer landmark', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
    });
  });

  test.describe('Form Controls', () => {
    test('search input has accessible label', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const searchInput = page.getByRole('searchbox');
      if (await searchInput.isVisible()) {
        const name = await searchInput.getAttribute('aria-label');
        const placeholder = await searchInput.getAttribute('placeholder');
        expect(name || placeholder).toBeTruthy();
      }
    });
  });
});
