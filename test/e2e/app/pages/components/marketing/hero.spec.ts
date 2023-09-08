import { test, expect, helpers, Engine } from '@test/utils/e2e/fixtures'

test.describe('Marketing Hero Component', () => {
  test('should display a marketing hero component', async ({ page, orm, folder }) => {
    // GIVEN
    const port = 50901
    const hero = {
      type: 'container',
      components: [
        {
          type: 'title',
          text: 'Requests',
          size: 'large',
        },
      ],
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
    await expect(page.getByText(hero.components[0].text)).toBeVisible()
    // await expect(page.getByText(hero.subtitle)).toBeVisible()
    // await expect(page.getByText(hero.primaryButton.label)).toBeVisible()
    // await expect(page.getByText(hero.secondaryButton.label)).toBeVisible()
    // await expect(page.getByAltText(hero.logo.alt)).toBeVisible()
    // await expect(page.getByAltText(hero.image.alt)).toBeVisible()
  })
})
