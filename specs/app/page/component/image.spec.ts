import { test, expect, helpers, drivers } from '@test/e2e/fixtures'

test.describe('Image component', () => {
  for (const ui of drivers.ui) {
    test.describe(ui.name, () => {
      test('should have width property by default', async ({ page }) => {
        // GIVEN
        const app = await helpers.startApp(
          {
            pages: [
              {
                path: '/',
                title: 'Home',
                components: [
                  {
                    type: 'image',
                    url: 'https://picsum.photos/200',
                    text: 'Image',
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
