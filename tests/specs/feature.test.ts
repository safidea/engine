import { test, expect } from '@playwright/test'
import { createFeature, type IFeature } from '@solumy/engine/feature'

test.describe('Feature specs', () => {
  test('should return error if a spec failed', async () => {
    // GIVEN
    const config: IFeature = {
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
    }

    // WHEN
    const { feature, errors } = createFeature(config)
    const specErrors = await feature?.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
    expect(specErrors).toHaveLength(1)
    expect(specErrors?.[0].code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
  })

  test('should return no error if a spec succeed', async () => {
    // GIVEN
    const config: IFeature = {
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
    }

    // WHEN
    const { feature, errors } = createFeature(config)
    const specErrors = await feature?.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
    expect(specErrors).toHaveLength(0)
  })
})
