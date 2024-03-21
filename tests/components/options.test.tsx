import { test, expect } from '@tests/fixtures'
import Page, { type Config as PageConfig } from '@solumy/engine/page'
import App, { type Config as AppConfig, type Options as AppOptions } from '@solumy/engine'
import { overwritten, customized } from '@tests/components'

test.describe('Custom component', () => {
  test('should render a overwritten paragraph component', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Paragraph',
          text: 'world',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page({ components: overwritten })
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain('Hello world')
  })

  test('should render a customized component', async ({ page }) => {
    // GIVEN
    const options: AppOptions = {
      components: {
        customized,
      },
    }
    const config: AppConfig = {
      name: 'Page',
      features: [
        {
          name: 'Feature',
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Customized',
                  customRef: 'MyComponent',
                },
              ],
            },
          ],
        },
      ],
    }
    const app = new App(options)
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const content = await page.textContent('p')
    expect(content).toContain('Customized component')
  })
})
