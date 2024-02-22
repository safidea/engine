import { test, expect } from '@playwright/test'
import type { Icon } from '@solumy/engine'
import Page, { type Config } from '@solumy/engine/page'

test.describe('Features component', () => {
  test('should render features', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const features: {
      title: string
      description: string
      icon: Icon
    }[] = [
      {
        title: 'Feature 1',
        description: 'Description 1',
        icon: 'ChartBarSquare',
      },
      {
        title: 'Feature 2',
        description: 'Description 2',
        icon: 'Scale',
      },
      {
        title: 'Feature 3',
        description: 'Description 3',
        icon: 'Cog6Tooth',
      },
    ]
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Features',
          title,
          description,
          features,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const titleLocator = page.locator('h2', { hasText: title })
    await expect(titleLocator).toBeVisible()

    const descriptionLocator = page.locator('p', { hasText: description })
    await expect(descriptionLocator).toBeVisible()

    for (const feature of features) {
      const featureTitleLocator = page.locator('h3', { hasText: feature.title })
      await expect(featureTitleLocator).toBeVisible()

      const featureDescriptionLocator = page.locator('p', {
        hasText: feature.description,
      })
      await expect(featureDescriptionLocator).toBeVisible()
    }
  })
})
