const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to login page...');
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });

  const emailInput = page.locator('input[type="text"], input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();

  await emailInput.fill('manager@bijlipay.com');
  await passwordInput.fill('password');
  await page.locator('button:has-text("Log In"), .q-btn[type="submit"]').first().click();

  await page.waitForURL('**/super/admin/dashboard', { timeout: 15000 });
  console.log('Logged in.');

  // Go to Users page
  await page.click('text="Users"');
  await page.waitForURL('**/super/admin/users**');
  await page.waitForTimeout(5000); // Wait for potential API response
  await page.screenshot({ path: 'users_page_data_check.png', fullPage: true });

  // Try to click "Add User"
  console.log('Navigating to Add User page...');
  await page.click('button:has-text("Add User")');
  await page.waitForURL('**/super/admin/users/add/user**');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'add_user_page.png', fullPage: true });

  // Check Hierarchy page
  console.log('Navigating to Hierarchy page...');
  await page.click('div.q-item:has-text("Hierarchy")');
  await page.waitForURL('**/super/admin/hierarchy**');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'hierarchy_page.png', fullPage: true });

  await browser.close();
})();
