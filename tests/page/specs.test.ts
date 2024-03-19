import { test, expect } from '@tests/fixtures'
import Feature, { type Config } from '@solumy/engine/feature'

test.describe('Pages specs', () => {
  test('should find an invalid page title', async () => {
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
    const feature = new Feature()
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(1)
    const [{ expected, received, code }] = errors
    expect(code).toBe('INVALID_TITLE')
    expect(expected).toBe('Title invalid')
    expect(received).toBe('Title')
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
    const feature = new Feature()
    const errors = await feature.test(config)

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
    const feature = new Feature()
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(1)
    const [{ expected, code }] = errors
    expect(code).toBe('TEXT_NOT_FOUND')
    expect(expected).toBe('invalid')
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
    const feature = new Feature()
    const errors = await feature.test(config)

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
    const feature = new Feature()
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(1)
    const [{ expected, code }] = errors
    expect(code).toBe('TEXT_NOT_FOUND')
    expect(expected).toBe('valid')
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
    const feature = new Feature()
    const errors = await feature.test(config)

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
    const feature = new Feature()
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(1)
    const [{ expected, code }] = errors
    expect(code).toBe('ATTRIBUTE_NOT_FOUND')
    expect(expected).toBe('/')
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
    const feature = new Feature()
    const errors = await feature.test(config)

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
              action: '#',
              title: { text: 'Form' },
              paragraph: { text: 'Form description' },
              inputs: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                },
              ],
              buttons: [
                {
                  type: 'submit',
                  label: 'Submit',
                },
              ],
            },
          ],
        },
      ],
    }

    // WHEN
    const feature = new Feature()
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(1)
    const [{ expected, received, code }] = errors
    expect(code).toBe('INPUT_NOT_FOUND')
    expect(expected).toBe('doe')
    expect(received).toBe('john')
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
              action: '#',
              title: { text: 'Form' },
              paragraph: { text: 'Form description' },
              inputs: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                },
              ],
              buttons: [
                {
                  type: 'submit',
                  label: 'Submit',
                },
              ],
            },
          ],
        },
      ],
    }

    // WHEN
    const feature = new Feature()
    const errors = await feature.test(config)

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
          then: [{ table: 'leads', find: [{ field: 'name', operator: 'is', value: 'john' }] }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Form',
              title: { text: 'Form' },
              paragraph: { text: 'Form description' },
              action: '/api/table/leads',
              method: 'POST',
              inputs: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                },
              ],
              buttons: [
                {
                  type: 'submit',
                  label: 'Submit',
                },
              ],
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
    const feature = new Feature()

    // WHEN
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })
})
