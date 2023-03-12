import { expect, test } from './lib/playwright.js';

test.describe('create Queue', () => {
	test('logged out user sees login button', async ({ page }) => {
		await page.goto('/');
		await page.getByText('Create Queue').click();
		await expect(page).toHaveURL(/.*login/);
		await expect(page.getByText('Continue with Spotify')).toBeVisible();
	});

	test('non-premium user sees hint for premium', async ({ page, auth }) => {
		await auth.login({ premium: false });
		await page.goto('/');
		await page.getByText('Create Queue').click();
		await expect(page).not.toHaveURL(/.*login/);
		await expect(page.getByText('HAS NO PREMIUM')).toBeVisible();
	});

	test('premium user can create Queue', async ({ page, auth }) => {
		await auth.login({ premium: true });
		await page.goto('/');
		await page.getByText('Create Queue').click();
		await expect(page.locator('#queue_name')).toBeVisible();
		await page.locator('#queue_name').fill('Test Queue');
		await page.getByText('Create Queue').click();
		await expect(page.getByText('Test Queue')).toBeVisible();
		await expect(page).toHaveURL(/.*queue\/[A-Z]{7}/);
	});
});
