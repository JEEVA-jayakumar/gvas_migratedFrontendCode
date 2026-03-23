import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        try:
            print("Navigating to login page...")
            await page.goto('http://localhost:8081/#/login', timeout=60000)

            # Wait for some content to appear
            await asyncio.sleep(10)
            await page.screenshot(path='login_debug_1.png')
            print("Login debug screenshot saved")

            # Try to find any input
            inputs = await page.query_selector_all('input')
            print(f"Found {len(inputs)} inputs")
            for i, input_el in enumerate(inputs):
                outer_html = await input_el.evaluate('el => el.outerHTML')
                print(f"Input {i}: {outer_html}")

            if len(inputs) >= 2:
                await inputs[0].fill('testsat@bijlipay.co.in')
                await inputs[1].fill('password')

                # Try to find login button
                buttons = await page.query_selector_all('button')
                print(f"Found {len(buttons)} buttons")
                for b in buttons:
                    text = await b.inner_text()
                    print(f"Button text: {text}")
                    if 'LOGIN' in text.upper():
                        await b.click()
                        break

                print("Waiting for dashboard...")
                # The URL might change to /sat/dashboard
                await page.wait_for_url('**/sat/dashboard', timeout=30000)
                print("Logged in successfully!")

                await asyncio.sleep(5)
                await page.screenshot(path='sat_dashboard_success.png')
            else:
                print("Could not find enough inputs to login.")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path='final_error.png')
            content = await page.content()
            with open('page_content.html', 'w') as f:
                f.write(content)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
