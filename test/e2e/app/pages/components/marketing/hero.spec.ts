import { ComponentDto } from '@adapter/api/page/dtos/ComponentDto'
import { test, expect, helpers, Engine } from '@test/utils/e2e/fixtures'

test.describe('Marketing Hero Component', () => {
  test.skip('should display a marketing hero component', async ({ page, orm, folder }) => {
    // GIVEN
    const port = 50901
    const hero: ComponentDto = {
      type: 'marketing/hero',
      title: 'Title',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      primaryButton: {
        label: 'Primary Button',
        link: '/primary-link',
      },
      secondaryButton: {
        label: 'Secondary Button',
        link: '/secondary-link',
      },
      logo: {
        url: `http://localhost:${port}/img/logo.svg`,
        alt: 'Logo',
      },
      image: {
        url: `http://localhost:${port}/img/image.svg`,
        alt: 'Image',
      },
    }
    await new Engine({ port, folder, orm })
      .config({
        pages: [
          {
            path: '/',
            components: [hero],
          },
        ],
      })
      .start()

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.getByText(hero.title)).toBeVisible()
    await expect(page.getByText(hero.subtitle)).toBeVisible()
    await expect(page.getByText(hero.primaryButton.label)).toBeVisible()
    await expect(page.getByText(hero.secondaryButton.label)).toBeVisible()
    await expect(page.getByAltText(hero.logo.alt)).toBeVisible()
    await expect(page.getByAltText(hero.image.alt)).toBeVisible()
  })
})
