import { test, expect } from '@playwright/test';

test('Playwright site title should contain Playwright', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('Playwright site get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole('heading', { name: 'Installation' })
  ).toBeVisible();
});

// ログインフォームのテスト
test('should display error message for invalid email on localhost', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/'); // ログインページのURLを指定

  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');
  const emailError = page.locator('#emailError');

  // await emailInput.fill('invalid-email');
  await passwordInput.fill('validpassword');
  await submitButton.click();

  // エラーメッセージが表示されるまでの適切な待機時間を設定するか、他の方法で待機する
  await page.waitForSelector('#emailError', {
    state: 'visible',
    timeout: 15000,
  }); // 15秒待機
  console.log('エラーメッセージのテキスト:', await emailError.textContent());
  await expect(emailError).toHaveText('メールアドレスが無効です', {
    timeout: 10000,
  });
});

test('should display error message for empty password on localhost', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/');

  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');
  const passwordError = page.locator('#passwordError');

  await emailInput.fill('valid@example.com');
  await passwordInput.fill('');
  await submitButton.click();

  await expect(passwordError).toHaveText(
    'パスワードは6文字以上でなければなりません'
  );
});

test('should not display error message for valid email and password on localhost', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/');

  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');
  const emailError = page.locator('#emailError');
  const passwordError = page.locator('#passwordError');

  await emailInput.fill('valid@example.com');
  await passwordInput.fill('validpassword');
  await submitButton.click();

  await expect(emailError).toHaveText('');
  await expect(passwordError).toHaveText('');
});
