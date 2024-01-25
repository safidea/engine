import { test, expect } from '@playwright/test'
import { createApp, type IApp } from '@solumy/engine'

test.describe('App specs', () => {
  test('should not find a text', async () => {
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
              then: [{ text: 'invalid' }],
            },
          ],
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'valid',
                },
              ],
            },
          ],
        },
      ],
    }

    // WHEN
    const { app } = createApp(config)
    const errors = await app!.testFeaturesSpecs()

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors![0].code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
  })

  test('should find a text', async () => {
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
              then: [{ text: 'valid' }],
            },
          ],
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'valid',
                },
              ],
            },
          ],
        },
      ],
    }

    // WHEN
    const { app } = createApp(config)
    const errors = await app!.testFeaturesSpecs()

    // THEN
    expect(errors).toHaveLength(0)
  })
})
