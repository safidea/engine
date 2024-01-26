import { test, expect } from '@playwright/test'
import { createApp, type IApp } from '@solumy/engine'

test.describe('App', () => {
  test('should start an app', async () => {
    // GIVEN
    const config: IApp = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
                },
              ],
            },
          ],
        },
      ],
    }
    const { app } = await createApp(config)

    // WHEN
    await app!.start()

    // THEN
    expect(app!.isRunning()).toBe(true)
  })

  test('should start an app after testing specs', async () => {
    // GIVEN
    const config: IApp = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          specs: [
            {
              name: 'display invalid text',
              when: [{ open: '/' }],
              then: [{ text: 'Hello world!' }],
            },
          ],
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
                },
              ],
            },
          ],
        },
      ],
    }
    const { app, errors } = await createApp(config)

    // WHEN
    await app!.start()

    // THEN
    expect(errors).toHaveLength(0)
    expect(app!.isRunning()).toBe(true)
  })

  test('should start an app on a dedicated PORT', async () => {
    // GIVEN
    const config: IApp = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
                },
              ],
            },
          ],
        },
      ],
    }
    const { app } = await createApp(config, { port: 3000 })

    // WHEN
    const url = await app!.start()

    // THEN
    expect(url).toBe('http://localhost:3000')
  })

  test('should check the app running status through /health endpoint', async ({ request }) => {
    // GIVEN
    const config: IApp = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
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
    const { success } = await request.get(url + '/health').then((res) => res.json())

    // THEN
    expect(success).toBe(true)
  })

  test('should display a paragraph', async ({ page }) => {
    // GIVEN
    const text = 'Hello world!'
    const config: IApp = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          pages: [
            {
              name: 'Page',
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

  test('should stop an app', async ({ request }) => {
    // GIVEN
    const config: IApp = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
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
    await app!.stop()
    const response = await request.get(url).catch((err) => err)

    // THEN
    expect(response.message).toContain('ECONNREFUSED')
  })
})
