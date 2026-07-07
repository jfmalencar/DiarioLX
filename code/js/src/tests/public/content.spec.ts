import { test, expect } from '@playwright/test';

test.describe('Public content pages', () => {
    test('article page shows the title and featured image', async ({ page }) => {
        await page.goto('/latest');
        await page.getByTestId('hero-article').first().click();
        await expect(page).toHaveURL(/\/p\//);

        const title = page.getByRole('heading', { level: 1 }).first();
        await expect(title).toBeVisible();
        expect((await title.innerText()).trim().length).toBeGreaterThan(0);

        await expect(page.locator('img').first()).toBeVisible();
    });

    test('category page shows a hero and content cards', async ({ page }) => {
        await page.goto('/');
        const href = await page.locator('a[href^="/c/"]').first().getAttribute('href');
        expect(href).toBeTruthy();

        await page.goto(href!);
        await expect(page).toHaveURL(/\/c\//);
        await expect(
            page.getByTestId('hero-article').or(page.getByTestId('content-card')).first(),
        ).toBeVisible();
    });
});
