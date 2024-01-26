import { test, expect } from '@playwright/test'
import { createFeature, type IFeature } from '@solumy/engine/feature'

test.describe('Feature specs', () => {
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
    const { feature } = await createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_TITLE_NOT_FOUND')
    if (data && 'feature' in data) {
      expect(data.expected).toBe('Title invalid')
      expect(data.received).toBe('Title')
    }
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
    const { feature } = await createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
  })

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
    const { feature } = await createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
    if (data && 'feature' in data) {
      expect(data.expected).toBe('invalid')
      expect(data.received).toBe('')
    }
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
    const { feature } = await createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should not find a text in a specific tag', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ text: 'valid', tag: 'h1' }],
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
    const { feature } = await createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
    if (data && 'feature' in data) {
      expect(data.expected).toBe('valid')
      expect(data.received).toBe('')
    }
  })

  test('should find a text in a specific tag', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ text: 'valid', tag: 'p' }],
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
    const { feature } = await createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should not find a text of an attribute in a specific tag', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ text: 'button', tag: 'a', attribute: 'href', value: '/' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Button',
              label: 'button',
              href: 'https://example.com/',
            },
          ],
        },
      ],
    }

    // WHEN
    const { feature } = await createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_ATTRIBUTE_NOT_FOUND')
    if (data && 'feature' in data) {
      expect(data.expected).toBe('/')
      expect(data.received).toBe('https://example.com/')
    }
  })

  test('should find a text of an attribute in a specific tag', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ text: 'button', tag: 'a', attribute: 'href', value: 'https://example.com/' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Button',
              label: 'button',
              href: 'https://example.com/',
            },
          ],
        },
      ],
    }

    // WHEN
    const { feature } = await createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
  })
})
