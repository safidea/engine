import { test, expect } from '@playwright/test'
import { createFeature, type IFeature } from '@solumy/engine/feature'

test.describe('Feature specs', () => {
  test('should return error if a spec failed', async () => {
    // GIVEN
    const config: IFeature = {
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
          then: [{ text: 'invalid' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'paragraph',
              text: 'valid',
            },
          ],
        },
      ],
    }

    // WHEN
    const { feature } = createFeature(config, { roles: [{ name: 'Role' }], components: [] })
    const errors = await feature?.testSpecs()

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors?.[0].code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
  })

  test('should return no error if a spec succeed', async () => {
    // GIVEN
    const config: IFeature = {
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
          then: [{ text: 'valid' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'paragraph',
              text: 'valid',
            },
          ],
        },
      ],
    }

    // WHEN
    const { feature } = createFeature(config, { roles: [{ name: 'Role' }], components: [] })
    const errors = await feature?.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
  })
})
