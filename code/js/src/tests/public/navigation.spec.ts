import { test, expect } from '@playwright/test';

test.describe('Public navigation', () => {
    test('home renders header and footer', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByTestId('site-header')).toBeVisible();
        await expect(page.getByTestId('site-footer')).toBeVisible();
    });

    test('navigates to the podcasts listing from the header', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('site-header').getByRole('link', { name: 'Podcasts' }).click();
        await expect(page).toHaveURL(/\/podcasts$/);
        await expect(page.getByRole('heading', { name: 'Podcasts' })).toBeVisible();
    });
});
