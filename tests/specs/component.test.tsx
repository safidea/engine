import { test, expect } from '@playwright/test'
import { createFeature, type IFeature } from '@solumy/engine/feature'
import { components } from '@tests/components'

test.describe('Components specs', () => {
  test('should test a page with a custom component', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
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
              component: 'Paragraph',
              text: 'world',
            },
          ],
        },
      ],
    }

    // WHEN
    const { feature, errors } = createFeature(config, { components })
    const specErrors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
    expect(specErrors).toHaveLength(0)
  })
})
