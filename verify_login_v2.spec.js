import { test, expect } from '@playwright/test';

test('verify login page and attempt login', async ({ page }) => {
  await page.goto('http://localhost:8082/#/login');

  // Take screenshot of login page
  await page.screenshot({ path: 'login_page_v2.png' });

  // Fill in credentials
  await page.fill('input[placeholder="Enter your email id"]', 'testsat@bijlipay.co.in');
  await page.fill('input[placeholder="Enter your password"]', 'password');

  // Click login
  await page.click('button:has-text("Log In")');

  // Wait for network idle or a specific response
  try {
    const response = await page.waitForResponse(response => response.url().includes('authorization/login'), { timeout: 10000 });
    console.log('Login Response Status:', response.status());
    const body = await response.text();
    console.log('Login Response Body:', body);
  } catch (e) {
    console.log('Login request did not complete in time or failed');
  }

  await page.screenshot({ path: 'after_login_attempt_v2.png' });
});
