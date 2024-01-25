import { test, expect } from '@playwright/test'
import { createPage, type IPage } from '@solumy/engine/page'

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
    const config: IPage = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Logos',
          title,
          logos,
        },
      ],
    }

    // WHEN
    const { page: pageEngine } = createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

    // THEN
    const titleContent = await page.textContent('h2')
    expect(titleContent).toContain(title)

    for (const logo of logos) {
      const image = page.getByRole('img', { name: logo.alt })
      await expect(image).toBeVisible()
      expect(await image.getAttribute('src')).toBe(logo.src)
    }
  })
})
