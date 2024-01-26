import { test, expect } from '@playwright/test'
import { createPage, type IPage } from '@solumy/engine/page'

test.describe('Features component', () => {
  test('should render features', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const features = [
      {
        title: 'Feature 1',
        description: 'Description 1',
        icon: 'icon',
      },
      {
        title: 'Feature 2',
        description: 'Description 2',
        icon: 'icon',
      },
      {
        title: 'Feature 3',
        description: 'Description 3',
        icon: 'icon',
      },
    ]
    const config: IPage = {
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
    const { page: pageEngine } = await createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

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
