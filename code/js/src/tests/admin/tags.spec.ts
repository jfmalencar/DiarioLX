import { test, expect, type Page } from '@playwright/test';

const TAGS_URL = '/admin/etiquetas';

async function goToTags(page: Page) {
    await page.goto(TAGS_URL);
    await expect(page).toHaveURL(new RegExp(`${TAGS_URL}(/.*)?$`));
}

async function openNewTagForm(page: Page) {
    await page.getByTestId('floating-action-button').click();

    const tag = page.getByTestId('action-new-tag');
    await expect(tag).toBeVisible();
    await tag.click();
}

async function fillTagName(page: Page, name: string) {
    const input = page.getByTestId('tag-input');
    await expect(input).toBeVisible();
    await input.fill(name);
}

async function saveTag(page: Page) {
    const button = page.getByTestId('save-tag-button');
    await expect(button).toBeVisible();
    await button.click();
}

test.describe('Tags', () => {
    test('display the list of tags', async ({ page }) => {
        await goToTags(page);
        await expect(page.getByTestId('tags-table')).toBeVisible();
    });

    test('create a new tag', async ({ page }) => {
        const tagName = `Etiqueta ${Date.now()}`;

        await goToTags(page);
        await openNewTagForm(page);
        await fillTagName(page, tagName);
        await saveTag(page);

        await expect(page.getByText(tagName, { exact: false }).first()).toBeVisible();
    });

    test('navigate to tag detail', async ({ page }) => {
        await goToTags(page);

        const firstTagLink = page.getByTestId('manage-tag-button-0').first();
        await expect(firstTagLink).toBeVisible();
        await firstTagLink.click();

        await expect(page).toHaveURL(/\/etiquetas\/[^/]+$/);
    });

    test('search tags', async ({ page }) => {
        await goToTags(page);

        await page.getByTestId('table-search-button').click();

        const input = page.getByTestId('table-search-input');
        await expect(input).toBeVisible();
        await input.fill('tag');

        await expect(input).toHaveValue('tag');
    });

    test('archive and restore tag', async ({ page }) => {
        await goToTags(page);

        const archiveButton = page.getByTestId('archive-button-0').first();
        await expect(archiveButton).toBeVisible();
        await archiveButton.click();

        const confirmButton = page.getByTestId('confirm-archive-button');
        await expect(confirmButton).toBeVisible();
        await confirmButton.click();

        const restoreButton = page.getByTestId('restore-button-0').first();
        await expect(restoreButton).toBeVisible();
        await restoreButton.click();

        const confirmRestoreButton = page.getByTestId('confirm-restore-button');
        await expect(confirmRestoreButton).toBeVisible();
        await confirmRestoreButton.click();
    });
});