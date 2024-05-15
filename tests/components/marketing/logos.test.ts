import { test, expect } from '@tests/fixtures'
import Page, { type Page as Config } from '@safidea/engine/page'

test.describe('Logos component', () => {
  test('should render logos', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const logos = [
      {
        src: 'https://via.placeholder.com/150',
        alt: 'logo-1',
      },
      {
        src: 'https://via.placeholder.com/150',
        alt: 'logo-2',
      },
      {
        src: 'https://via.placeholder.com/150',
        alt: 'logo-3',
      },
    ]
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Logos',
          title: { text: title },
          images: logos,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    console.log(html)
    await page.setContent(html)

    // THEN
    const titleContent = await page.textContent('h4')
    expect(titleContent).toContain(title)

    for (const logo of logos) {
      const image = page.getByRole('img', { name: logo.alt })
      await expect(image).toBeVisible()
      expect(await image.getAttribute('src')).toBe(logo.src)
    }
  })
})
