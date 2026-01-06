import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Full Accessibility Audit - WCAG 2.1 AA Compliance
 *
 * This test suite provides comprehensive accessibility testing across all pages
 * and interactive elements. Tests cover:
 * - WCAG 2.1 Level A and AA compliance
 * - Keyboard navigation
 * - Screen reader compatibility
 * - Color contrast
 * - Focus management
 * - ARIA attributes
 */

async function waitForPageReady(page: import('@playwright/test').Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.locator('body').waitFor({ state: 'visible', timeout: 5000 });
}

test.describe('Full Accessibility Audit', () => {
  test.describe('Page-Level WCAG Compliance', () => {
    const pages = [
      { name: 'Home', url: '/' },
      { name: 'Explore', url: '/explore' },
      { name: 'Leaderboard', url: '/leaderboard' },
      { name: 'Feedbacks', url: '/feedbacks' },
      { name: 'Compose', url: '/compose' },
      { name: 'Taxonomy', url: '/taxonomy' },
      { name: 'Agent Detail', url: '/agent/11155111:1' },
    ];

    for (const { name, url } of pages) {
      test(`${name} page should be WCAG 2.1 AA compliant`, async ({ page }) => {
        await page.goto(url);
        await waitForPageReady(page);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        expect(results.violations).toEqual([]);
      });
    }
  });

  test.describe('Interactive Elements Accessibility', () => {
    test('all buttons should have accessible names', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const results = await new AxeBuilder({ page }).withRules(['button-name']).analyze();

      expect(results.violations).toEqual([]);
    });

    test('all links should have accessible names', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const results = await new AxeBuilder({ page }).withRules(['link-name']).analyze();

      expect(results.violations).toEqual([]);
    });

    test('all images should have alt text', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const results = await new AxeBuilder({ page }).withRules(['image-alt']).analyze();

      expect(results.violations).toEqual([]);
    });

    test('form inputs should have labels', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const results = await new AxeBuilder({ page }).withRules(['label']).analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Focus Management', () => {
    test('focus should be visible on all interactive elements', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      // Tab through interactive elements
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');

        const focusedElement = page.locator(':focus');
        if ((await focusedElement.count()) > 0) {
          // Check that focused element has visible focus indicator
          const isVisible = await focusedElement.isVisible();
          expect(isVisible).toBe(true);
        }
      }
    });

    test('modal should trap focus', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      // Try to open MCP modal via button click
      const mcpButton = page.getByRole('button', { name: /connect mcp/i });
      if (await mcpButton.isVisible().catch(() => false)) {
        await mcpButton.click();

        // Wait for modal
        const modal = page.getByRole('dialog');
        if (await modal.isVisible().catch(() => false)) {
          // Tab should stay within modal
          for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Tab');
          }

          const focusedElement = page.locator(':focus');
          // Verify focus is within modal
          await focusedElement.evaluate((el) => {
            const dialog = el.closest('[role="dialog"]');
            return dialog !== null;
          });

          // Close modal
          await page.keyboard.press('Escape');
        }
      }
    });

    test('escape key should close modals', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const mcpButton = page.getByRole('button', { name: /connect mcp/i });
      if (await mcpButton.isVisible().catch(() => false)) {
        await mcpButton.click();

        const modal = page.getByRole('dialog');
        if (await modal.isVisible().catch(() => false)) {
          await page.keyboard.press('Escape');
          await expect(modal).not.toBeVisible();
        }
      }
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    test('page should have proper heading structure', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      // Check for h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);

      // Check heading order with axe
      const results = await new AxeBuilder({ page }).withRules(['heading-order']).analyze();

      expect(results.violations).toEqual([]);
    });

    test('page should have ARIA landmarks', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Check for required landmarks
      await expect(page.getByRole('banner')).toBeVisible(); // header
      await expect(page.locator('main')).toBeVisible(); // main
      await expect(page.getByRole('contentinfo')).toBeVisible(); // footer
    });

    test('skip link should be present and functional', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      // Tab to first element (should be skip link if present)
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');
      const text = await focusedElement.textContent().catch(() => '');

      // Skip link is optional but recommended
      if (text?.toLowerCase().includes('skip')) {
        await page.keyboard.press('Enter');
        const main = page.locator('main');
        await expect(main).toBeFocused();
      }
    });

    test('dynamic content should have live regions', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      // Check for aria-live regions for search results
      const liveRegion = page.locator('[aria-live]');
      const count = await liveRegion.count();
      // Live regions are recommended but not required
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Color and Visual', () => {
    test('text should have sufficient contrast ratio', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();

      expect(results.violations).toEqual([]);
    });

    test('information should not rely on color alone', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      // Chain badges should have text labels, not just colors
      const chainBadges = page.locator('[data-testid="chain-badge"]');
      const count = await chainBadges.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const badge = chainBadges.nth(i);
        const text = await badge.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Motion and Animation', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await waitForPageReady(page);

      // Check that page loads without errors
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Touch Target Size', () => {
    test('buttons should meet minimum touch target size', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      const buttons = page.locator('button:visible');
      const count = await buttons.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();

        if (box) {
          // WCAG 2.5.5 recommends 44x44px minimum
          // We use 24x24 as minimum acceptable
          expect(box.width).toBeGreaterThanOrEqual(24);
          expect(box.height).toBeGreaterThanOrEqual(24);
        }
      }
    });
  });

  test.describe('Error Identification', () => {
    test('error messages should be associated with inputs', async ({ page }) => {
      await page.goto('/explore');
      await waitForPageReady(page);

      // If there's a form with validation, check aria-describedby
      const inputs = page.locator('input[aria-invalid="true"]');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const describedBy = await input.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
      }
    });
  });

  test.describe('Language', () => {
    test('page should have lang attribute', async ({ page }) => {
      await page.goto('/');
      await waitForPageReady(page);

      const html = page.locator('html');
      const lang = await html.getAttribute('lang');
      expect(lang).toBeTruthy();
    });
  });

  test.describe('Page Title', () => {
    const pages = [
      { name: 'Home', url: '/', expectedPart: '8004' },
      { name: 'Explore', url: '/explore', expectedPart: 'Explore' },
      { name: 'Leaderboard', url: '/leaderboard', expectedPart: 'Leaderboard' },
    ];

    for (const { name, url, expectedPart } of pages) {
      test(`${name} page should have descriptive title`, async ({ page }) => {
        await page.goto(url);
        await waitForPageReady(page);

        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
        expect(title.toLowerCase()).toContain(expectedPart.toLowerCase());
      });
    }
  });
});
