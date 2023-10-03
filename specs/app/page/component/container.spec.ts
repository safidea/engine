import { test, expect, helpers, drivers } from '@test/e2e/fixtures'

test.describe('Container component', () => {
  for (const ui of drivers.ui) {
    test.describe(ui.name, () => {
      test.skip('should have width property by default', async ({ page }) => {
        // GIVEN
        const app = await helpers.startApp(
          {
            pages: [
              {
                path: '/',
                title: 'Home',
                components: [
                  {
                    type: 'container',
                    components: [
                      {
                        type: 'title',
                        text: 'Title',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            ui: ui.value as any,
          }
        )

        // WHEN
        await page.goto(helpers.getUrl(app.port, '/'))

        // THEN
        const imageWidth = await page.getByRole('img').getAttribute('width')
        expect(imageWidth).toEqual('50')
      })
    })
  }
})
