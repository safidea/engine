import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Modal component', () => {
  test('should open a modal with id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Modal',
              id: 'my-modal',
              button: {
                label: 'Open Modal',
              },
              header: [
                {
                  component: 'Title',
                  text: 'Modal Title',
                },
              ],
              body: [
                {
                  component: 'Paragraph',
                  text: 'Modal Paragraph',
                },
              ],
              footer: [
                {
                  component: 'Button',
                  label: 'Save',
                },
              ],
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.getByText('Open Modal').click()

    // THEN
    await expect(page.locator('#my-modal')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })
})
