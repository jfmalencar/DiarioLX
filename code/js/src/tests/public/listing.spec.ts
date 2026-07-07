import { test, expect } from '@playwright/test';

test.describe('Content listing', () => {
    test('renders content cards', async ({ page }) => {
        await page.goto('/podcasts');
        await expect(page.getByRole('heading', { name: 'Podcasts' })).toBeVisible();
        await expect(page.getByTestId('content-card').first()).toBeVisible();
    });

    test('load more button appends more content', async ({ page }) => {
        await page.goto('/latest');
        const cards = page.getByTestId('content-card');
        await expect(cards.first()).toBeVisible();

        const before = await cards.count();
        await page.getByTestId('load-more').click();

        await expect(async () => {
            expect(await cards.count()).toBeGreaterThan(before);
        }).toPass();
    });
});
