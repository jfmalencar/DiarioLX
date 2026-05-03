import { test, expect, type Page } from '@playwright/test';
const CATEGORIES_URL = '/admin/categorias';

async function gotoCategories(page: Page) {
    await page.goto(CATEGORIES_URL);
    await expect(page).toHaveURL(new RegExp(`${CATEGORIES_URL}(/.*)?$`));
}

async function openNewCategoryForm(page: Page) {
    await page.getByTestId('floating-action-button').click()
    const category = page.getByTestId('action-new-category');
    await expect(category).toBeVisible();
    await category.click();
}

async function fillCategoryName(page: Page, name: string) {
    const input = page.getByTestId('category-input')
    await expect(input).toBeVisible();
    await input.fill(name);
}

async function saveCategory(page: Page) {
    const button = page.getByTestId('save-category-button')
    await expect(button).toBeVisible();
    await button.click();
}

test.describe('Categories', () => {
    test('display the list of categories', async ({ page }) => {
        await gotoCategories(page);
        await expect(page.getByTestId('categories-table')).toBeVisible();
    });

    test('create a new category', async ({ page }) => {
        const categoryName = `Categoria ${Date.now()}`;
        await gotoCategories(page);
        await openNewCategoryForm(page);
        await fillCategoryName(page, categoryName);
        await saveCategory(page);
        await expect(page.getByText(categoryName, { exact: false }).first()).toBeVisible();
    });

    test('navigate to category detail', async ({ page }) => {
        await gotoCategories(page);
        const firstCategoryLink = page.getByTestId('manage-category-button-0').first();
        await expect(firstCategoryLink).toBeVisible();
        await firstCategoryLink.click();
        await expect(page).toHaveURL(/\/categorias\/[^/]+$/);
    });

    test('search categories', async ({ page }) => {
        await gotoCategories(page);
        await page.getByTestId('table-search-button').click();
        const input = page.getByTestId('table-search-input');
        await expect(input).toBeVisible();
        await input.fill('cat');
        await expect(input).toHaveValue('cat');
    });

    test('archive and restore category', async ({ page }) => {
        await gotoCategories(page);

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
