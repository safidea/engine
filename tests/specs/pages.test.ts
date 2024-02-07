import { test, expect } from '@playwright/test'
import Feature, { type Config } from '@solumy/engine/feature'

test.describe('Pages specs', () => {
  test('should not find a page title', async () => {
    // GIVEN
    const config: Config = {
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
          head: { title: 'Title' },
          body: [],
        },
      ],
    }

    // WHEN
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_TITLE_NOT_FOUND')
    if (data && 'feature' in data && 'expected' in data) {
      expect(data.expected).toBe('Title invalid')
      expect(data.received).toBe('Title')
    }
  })

  test('should find a page title', async () => {
    // GIVEN
    const config: Config = {
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
          head: { title: 'Title' },
          body: [],
        },
      ],
    }

    // WHEN
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should not find a text', async () => {
    // GIVEN
    const config: Config = {
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
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
    if (data && 'feature' in data && 'expected' in data) {
      expect(data.expected).toBe('invalid')
    }
  })

  test('should find a text', async () => {
    // GIVEN
    const config: Config = {
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
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should not find a text in a specific tag', async () => {
    // GIVEN
    const config: Config = {
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
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
    if (data && 'feature' in data && 'expected' in data) {
      expect(data.expected).toBe('valid')
    }
  })

  test('should find a text in a specific tag', async () => {
    // GIVEN
    const config: Config = {
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
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should not find an attribute in a specific tag', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ tag: 'a', attribute: 'href', value: '/' }],
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
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_ATTRIBUTE_NOT_FOUND')
    if (data && 'feature' in data && 'expected' in data) {
      expect(data.expected).toBe('/')
    }
  })

  test('should find a text of an attribute in a specific tag', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ tag: 'a', attribute: 'href', value: 'https://example.com/' }],
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
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should not find an input with a specific value', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }, { fill: 'name', value: 'john' }],
          then: [{ input: 'name', value: 'doe' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Form',
              title: 'Form',
              description: 'Form description',
              inputs: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                },
              ],
              submitButton: {
                label: 'Submit',
              },
            },
          ],
        },
      ],
    }

    // WHEN
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_INPUT_NOT_FOUND')
    if (data && 'feature' in data && 'expected' in data) {
      expect(data.expected).toBe('doe')
      expect(data.received).toBe('john')
    }
  })

  test('should find an input with a specific value', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }, { fill: 'name', value: 'john' }],
          then: [{ input: 'name', value: 'john' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Form',
              title: 'Form',
              description: 'Form description',
              inputs: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                },
              ],
              submitButton: {
                label: 'Submit',
              },
            },
          ],
        },
      ],
    }

    // WHEN
    const feature = new Feature(config)
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should submit a form into database', async () => {
    // GIVEN
    const successMessage = 'Form submitted'
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'submit form to database',
          when: [
            { open: '/' },
            { fill: 'name', value: 'john' },
            { click: 'Submit' },
            { waitForText: successMessage },
          ],
          then: [{ table: 'leads', findOne: [{ field: 'name', operator: 'is', value: 'john' }] }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Form',
              title: 'Form',
              description: 'Form description',
              action: '/api/table/leads',
              method: 'POST',
              inputs: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                },
              ],
              submitButton: {
                label: 'Submit',
              },
              successMessage,
            },
          ],
        },
      ],
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'name',
              type: 'SingleLineText',
            },
          ],
        },
      ],
    }
    const feature = new Feature(config)

    // WHEN
    const errors = await feature.test()

    // THEN
    expect(errors).toHaveLength(0)
  })
})
