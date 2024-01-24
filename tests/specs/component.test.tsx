import { test, expect } from '@playwright/test'
import { createApp, type IApp } from '@solumy/engine/app'

test.describe('Components specs', () => {
  test.skip('should test a page with a custom component', async () => {
    // GIVEN
    const config: IApp = {
      name: 'App',
      roles: [{ name: 'Role' }],
      features: [
        {
          name: 'Feature',
          story: {
            asRole: 'Role',
            iWant: 'I want',
            soThat: 'So that',
          },
          specs: [
            {
              name: 'display invalid text',
              when: [{ open: '/' }],
              then: [{ text: 'Hello world' }],
            },
          ],
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'paragraph',
                  text: 'world',
                },
              ],
            },
          ],
        },
      ],
      translations: [],
      components: [
        {
          name: 'paragraph',
          template: ({ text }) => <p>Hello {text}</p>,
        },
      ],
    }

    // WHEN
    const { app } = createApp(config)
    const errors = await app?.testFeaturesSpecs()

    // THEN
    expect(app).toBeDefined()
    expect(errors).toHaveLength(0)
  })
})
