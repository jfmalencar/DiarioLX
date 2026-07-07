import { test, expect, type Page } from '@playwright/test';

// Derive a real search term from an existing article title, so results are guaranteed.
async function termFromLatest(page: Page): Promise<string> {
    await page.goto('/latest');
    const title = page.getByTestId('content-card').first().locator('h3').first();
    await expect(title).toBeVisible();
    const words = (await title.innerText())
        .split(/\s+/)
        .map((w) => w.replace(/[^\p{L}]/gu, ''))
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);
    return words[0] ?? 'a';
}

test.describe('Public search', () => {
    test('opens and closes the search overlay', async ({ page }) => {
        await page.goto('/');

        await page.getByTestId('search-trigger').click();
        await expect(page.getByTestId('search-overlay')).toBeVisible();

        // Escape closes it.
        await page.keyboard.press('Escape');
        await expect(page.getByTestId('search-overlay')).toHaveCount(0);

        // The close button closes it too.
        await page.getByTestId('search-trigger').click();
        await page.getByRole('button', { name: 'Fechar pesquisa' }).click();
        await expect(page.getByTestId('search-overlay')).toHaveCount(0);
    });

    test('shows live results for a real term', async ({ page }) => {
        const term = await termFromLatest(page);

        await page.getByTestId('search-trigger').click();
        await page.getByTestId('search-input').fill(term);

        await expect(page.getByTestId('search-result').first()).toBeVisible();
    });

    test('shows an empty state for a term with no matches', async ({ page }) => {
        await page.goto('/');

        await page.getByTestId('search-trigger').click();
        await page.getByTestId('search-input').fill('zzxqwlkjmnqpv');

        await expect(page.getByText(/Não foram encontrados resultados/)).toBeVisible();
    });

    test('Enter navigates to the /s results page', async ({ page }) => {
        const term = await termFromLatest(page);

        await page.getByTestId('search-trigger').click();
        await page.getByTestId('search-input').fill(term);
        await page.getByTestId('search-input').press('Enter');

        await expect(page).toHaveURL(/\/s\?q=/);
        await expect(page.getByRole('heading', { name: /Resultados para/ })).toBeVisible();
    });

    test('clicking a result opens the article', async ({ page }) => {
        const term = await termFromLatest(page);

        await page.getByTestId('search-trigger').click();
        await page.getByTestId('search-input').fill(term);
        await page.getByTestId('search-result').first().click();

        await expect(page).toHaveURL(/\/p\//);
    });

    test('results page is reachable directly, empty query prompts for a term', async ({ page }) => {
        const term = await termFromLatest(page);

        await page.goto(`/s?q=${encodeURIComponent(term)}`);
        await expect(page.getByRole('heading', { name: /Resultados para/ })).toBeVisible();

        await page.goto('/s');
        await expect(page.getByText('Escreva um termo para pesquisar.')).toBeVisible();
    });

    test('locks background scroll while the overlay is open', async ({ page }) => {
        await page.goto('/');

        await page.getByTestId('search-trigger').click();
        await expect(page.getByTestId('search-overlay')).toBeVisible();
        await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

        await page.keyboard.press('Escape');
        await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
    });
});
