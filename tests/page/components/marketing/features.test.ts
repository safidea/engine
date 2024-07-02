import { test, expect } from '@tests/fixtures'
import Page, { type Page as Config } from '@safidea/engine/page'

test.describe('Features component', () => {
  test('should render features', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Features',
          title: { text: title },
          paragraph: { text: description },
          features: [
            {
              title: { text: 'Feature 1' },
              paragraph: { text: 'Description 1' },
              icon: { name: 'ChartBarSquare' },
            },
            {
              title: { text: 'Feature 2' },
              paragraph: { text: 'Description 2' },
              icon: { name: 'Scale' },
            },
            {
              title: { text: 'Feature 3' },
              paragraph: { text: 'Description 3' },
              icon: { name: 'Cog6Tooth' },
            },
          ],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const titleLocator = page.locator('h4', { hasText: title })
    await expect(titleLocator).toBeVisible()

    const descriptionLocator = page.locator('p', { hasText: description })
    await expect(descriptionLocator).toBeVisible()

    const component = config.body[0]
    if (!('blockRef' in component) && component.component === 'Features') {
      for (const feature of component.features) {
        const featureTitleLocator = page.locator('h6', { hasText: feature.title.text })
        await expect(featureTitleLocator).toBeVisible()

        const featureDescriptionLocator = page.locator('p', {
          hasText: feature.paragraph.text,
        })
        await expect(featureDescriptionLocator).toBeVisible()
      }
    }
  })

  test('should display the features id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Features',
          id: 'my-features',
          title: { text: 'This is a title' },
          paragraph: { text: 'This is a description' },
          features: [
            {
              title: { text: 'Feature 1' },
              paragraph: { text: 'Description 1' },
              icon: { name: 'ChartBarSquare' },
            },
            {
              title: { text: 'Feature 2' },
              paragraph: { text: 'Description 2' },
              icon: { name: 'Scale' },
            },
            {
              title: { text: 'Feature 3' },
              paragraph: { text: 'Description 3' },
              icon: { name: 'Cog6Tooth' },
            },
          ],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const features = page.locator('#my-features')
    await expect(features).toBeVisible()
  })
})
