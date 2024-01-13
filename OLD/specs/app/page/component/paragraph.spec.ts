import { test, expect, helpers, drivers } from '@test/e2e/fixtures'

test.describe('Paragraph component', () => {
  for (const ui of drivers.ui) {
    test.describe(ui.name, () => {
      test('should have an icon displayed at the beginning', async ({ page }) => {
        // GIVEN
        const app = await helpers.startApp(
          {
            pages: [
              {
                name: 'home',
                path: '/',
                title: 'Home',
                components: [
                  {
                    type: 'paragraph',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    icon: {
                      name: 'home',
                    },
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
        const [icon] = await page.locator('svg').all()
        expect(icon).toBeDefined()
      })
    })
  }
})
