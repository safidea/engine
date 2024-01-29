import { test, expect } from '@playwright/test'
import { createApp, type IApp } from '@solumy/engine'

test.describe('App with pages', () => {
  test('should display a paragraph', async ({ page }) => {
    // GIVEN
    const text = 'Hello world!'
    const config: IApp = {
      name: 'App',
      features: [
        {
          name: 'display paragraph',
          pages: [
            {
              name: 'paragraph',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text,
                },
              ],
            },
          ],
        },
      ],
    }
    const { app } = await createApp(config)
    const url = await app!.start()

    // WHEN
    await page.goto(url)
    const paragraphText = await page.textContent('p')

    // THEN
    expect(paragraphText).toBe(text)
  })
})
