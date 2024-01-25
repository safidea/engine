import { test, expect } from '@playwright/test'
import { createFeature, type IFeature } from '@solumy/engine/feature'

test.describe('Feature specs', () => {
  test('should not find a text', async () => {
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
    const { feature } = createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors[0].code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
  })

  test('should find a text', async () => {
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
    const { feature } = createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should not find a page title', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ title: 'Title invalid' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          title: 'Title',
          body: [],
        },
      ],
    }

    // WHEN
    const { feature } = createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors[0].code).toBe('SPEC_ERROR_TITLE_NOT_FOUND')
  })

  test('should find a page title', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ title: 'Title' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          title: 'Title',
          body: [],
        },
      ],
    }

    // WHEN
    const { feature } = createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
  })
})
