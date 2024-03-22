import { test, expect } from '@tests/fixtures'
import App, { type Config as AppConfig } from '@solumy/engine'

test.describe('Modal component', () => {
  test('should open a modal', async ({ page }) => {
    // GIVEN
    const config: AppConfig = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Modal',
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
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.getByText('Open Modal').click()

    // THEN
    await expect(page.getByText('Modal Title')).toBeVisible()
    await expect(page.getByText('Modal Paragraph')).toBeVisible()
    await expect(page.getByText('Save')).toBeVisible()
  })
})
