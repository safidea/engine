import { test, expect, helpers, drivers } from '@test/e2e/fixtures'

test.describe('Title component', () => {
  for (const ui of drivers.ui) {
    test.describe(ui.name, () => {
      test('should have size property by default', async ({ page }) => {
        // GIVEN
        const app = await helpers.startApp(
          {
            pages: [
              {
                path: '/',
                title: 'Home',
                components: [
                  {
                    type: 'title',
                    text: 'Title',
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
        const size = await page.getByRole('heading').getAttribute('data-size')
        expect(size).toEqual('medium')
      })
    })
  }
})
