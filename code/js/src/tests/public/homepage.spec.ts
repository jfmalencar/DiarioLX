import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test('renders the hero and key sections', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByTestId('hero-article').first()).toBeVisible();

        for (const name of ['Fotografia', 'Podcasts', 'Vídeos', 'Equipa']) {
            await expect(page.getByRole('heading', { name }).first()).toBeVisible();
        }
    });

    test('opens an article from the hero', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('hero-article').first().click();
        await expect(page).toHaveURL(/\/p\//);
    });
});
