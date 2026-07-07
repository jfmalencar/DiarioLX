import { test, expect } from '@playwright/test';

test.describe('Public routing (/c and /t)', () => {
    test('category pages render at /c/<slug>', async ({ page }) => {
        await page.goto('/');

        const href = await page.locator('a[href^="/c/"]').first().getAttribute('href');
        expect(href).toBeTruthy();

        await page.goto(href!);
        await expect(page).toHaveURL(/\/c\//);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('tag pages render at /t/<slug> from an article', async ({ page }) => {
        await page.goto('/latest');
        await page.getByTestId('hero-article').first().click();
        await expect(page).toHaveURL(/\/p\//);

        const tag = page.locator('a[href^="/t/"]').first();
        await expect(tag).toBeVisible();
        await tag.click();

        await expect(page).toHaveURL(/\/t\//);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('legacy /category and /tag routes no longer exist', async ({ page }) => {
        await page.goto('/category/some-slug');
        await expect(page.getByTestId('not-found')).toBeVisible();

        await page.goto('/tag/some-slug');
        await expect(page.getByTestId('not-found')).toBeVisible();
    });
});
