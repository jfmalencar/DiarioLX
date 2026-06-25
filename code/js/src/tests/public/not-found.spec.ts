import { test, expect } from '@playwright/test';

test.describe('Not found', () => {
    test('unknown route renders the 404 page', async ({ page }) => {
        await page.goto('/this-route-does-not-exist');
        await expect(page.getByTestId('not-found')).toBeVisible();
    });

    test('404 page links back to the homepage', async ({ page }) => {
        await page.goto('/this-route-does-not-exist');
        await page.getByTestId('home-link').click();
        await expect(page).toHaveURL(/localhost:5173\/$/);
        await expect(page.getByTestId('not-found')).toHaveCount(0);
    });
});
