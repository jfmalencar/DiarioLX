import { test as setup } from '@playwright/test';

const LOGIN_URL = '/admin/login';

setup('login', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.getByTestId('username-login').fill('admin');
    await page.getByTestId('password-login').fill('Test_123');
    await page.getByTestId('submit-login').click();
    await page.waitForURL('/admin');
    await page.context().storageState({ path: 'test-storageState.json' });
});
