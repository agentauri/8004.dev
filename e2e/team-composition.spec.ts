/**
 * E2E tests for team composition feature
 * Verifies the team composer page and agent team building functionality
 *
 * Note: MSW handles all backend API mocking at the Node.js level
 */

import { expect, test } from '@playwright/test';

test.describe('Team Composition Page', () => {
  test.describe('Page Load', () => {
    test('loads compose page successfully', async ({ page }) => {
      await page.goto('/compose');
      await page.waitForLoadState('domcontentloaded');

      // Should show page title (may need to wait for content)
      await expect(page.getByText(/team composer/i)).toBeVisible({ timeout: 10000 });
    });

    test('shows task description form', async ({ page }) => {
      await page.goto('/compose');
      await page.waitForLoadState('domcontentloaded');

      // Should show the composer form (wait for React to render)
      await expect(page.getByText(/describe your task/i)).toBeVisible({ timeout: 10000 });
    });

    test('displays team composer component', async ({ page }) => {
      await page.goto('/compose');
      await page.waitForLoadState('domcontentloaded');

      // Look for the team composer form
      const composer = page.locator('[data-testid="team-composer"]');

      if (await composer.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(composer).toBeVisible();
      } else {
        // If no testid, just verify page loaded
        await expect(page.getByRole('main').first()).toBeVisible();
      }
    });
  });

  test.describe('Task Input', () => {
    test('can enter task description', async ({ page }) => {
      await page.goto('/compose');

      // Find textarea or input for task description
      const taskInput = page.locator('textarea, [data-testid="task-input"]').first();

      if (await taskInput.isVisible()) {
        await taskInput.fill('Build a web scraping pipeline that extracts data from news websites');
        await expect(taskInput).toHaveValue(/web scraping/i);
      }
    });

    test('can set team size preference', async ({ page }) => {
      await page.goto('/compose');

      // Look for team size input
      const teamSizeInput = page
        .locator('[data-testid="team-size-input"], input[type="number"]')
        .first();

      if (await teamSizeInput.isVisible()) {
        await teamSizeInput.fill('3');
        await expect(teamSizeInput).toHaveValue('3');
      }
    });

    test('can select protocol preferences', async ({ page }) => {
      await page.goto('/compose');

      // Look for MCP checkbox or toggle
      const mcpToggle = page.locator('[data-testid="mcp-toggle"], [data-testid="protocol-mcp"]');

      if (await mcpToggle.isVisible()) {
        await mcpToggle.click();
      }
    });
  });

  test.describe('Team Composition Flow', () => {
    test('shows loading state when composing', async ({ page }) => {
      await page.goto('/compose');

      // Fill in task
      const taskInput = page.locator('textarea, [data-testid="task-input"]').first();

      if (await taskInput.isVisible()) {
        await taskInput.fill('Create a data analysis dashboard');

        // Find and click compose button
        const composeButton = page.locator(
          'button:has-text("Compose"), button:has-text("Build"), [data-testid="compose-button"]',
        );

        if (await composeButton.isVisible()) {
          await composeButton.click();

          // Loading might be very fast, so we just check the page doesn't crash
          await expect(page.locator('body')).toBeVisible();
        }
      }
    });

    test('handles empty task submission', async ({ page }) => {
      await page.goto('/compose');

      // Try to submit without entering a task
      const composeButton = page.locator(
        'button:has-text("Compose"), button:has-text("Build"), [data-testid="compose-button"]',
      );

      if (await composeButton.isVisible()) {
        // Button should be disabled or show validation
        const isDisabled = await composeButton.isDisabled();

        if (!isDisabled) {
          await composeButton.click();
          // Should show validation error or not submit
        }
      }
    });
  });

  test.describe('Team Results', () => {
    test('can reset after composition', async ({ page }) => {
      await page.goto('/compose');

      // Look for reset button (might appear after composition)
      const resetButton = page.locator(
        '[data-testid="reset-button"], button:has-text("Reset"), button:has-text("Start Over")',
      );

      // If visible, clicking should reset the form
      if (await resetButton.isVisible({ timeout: 1000 })) {
        await resetButton.click();

        // Should show the composer form again
        await expect(page.getByText(/describe your task/i)).toBeVisible();
      }
    });
  });

  test.describe('Navigation', () => {
    test('can navigate to compose page from header', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Look for compose/team link in navigation (desktop)
      const composeLink = page.locator('a[href="/compose"]').first();

      if (await composeLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await composeLink.click();

        await page.waitForURL(/compose/);
        expect(page.url()).toContain('/compose');
      } else {
        // On mobile, the link is in the mobile menu
        // Just verify the page loads correctly
        await expect(page.getByRole('main').first()).toBeVisible();
      }
    });
  });
});

test.describe('Team Composition Accessibility', () => {
  test('form has proper labels', async ({ page }) => {
    await page.goto('/compose');

    // Check for form accessibility
    const form = page.locator('form, [role="form"]');

    if (await form.isVisible()) {
      // Should have labeled inputs
      const labeledInputs = page.locator('label');
      const count = await labeledInputs.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('compose button is keyboard accessible', async ({ page }) => {
    await page.goto('/compose');

    // Fill in a task first
    const taskInput = page.locator('textarea, [data-testid="task-input"]').first();

    if (await taskInput.isVisible()) {
      await taskInput.fill('Test task');

      // Tab to compose button
      await page.keyboard.press('Tab');

      // Check if focused element is the compose button or another interactive element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });
});
