import { test, expect } from '@tests/fixtures'
import { components } from '@tests/components'
import App, { type App as Config } from '@safidea/engine'

test.describe('Custom App', () => {
  test('should render a custom paragraph component', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'world',
            },
          ],
        },
      ],
    }
    const app = new App({ components: { Paragraph: components.Paragraph } })
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain('Hello world')
  })
})
