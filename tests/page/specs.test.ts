import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Pages tests', () => {
  test.slow()

  test('should find an invalid page title', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Title', title: 'Title invalid' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).rejects.toThrow('Title invalid')
  })

  test('should find a page title', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Title', title: 'Title' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })

  test('should not find a text', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Text', text: 'invalid' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).rejects.toThrow('TEXT_NOT_FOUND')
  })

  test('should find a text', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Text', text: 'valid' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })

  test('should not find a text in a specific tag', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Text', text: 'valid', tag: 'h1' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).rejects.toThrow('TEXT_NOT_FOUND')
  })

  test('should find a text in a specific tag', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Text', text: 'valid', tag: 'p' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })

  test('should not find an attribute in a specific tag', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Attribute', tag: 'a', attribute: 'href', value: '/' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).rejects.toThrow('ATTRIBUTE_NOT_FOUND')
  })

  test('should find a text of an attribute in a specific tag', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [
            { expect: 'Attribute', tag: 'a', attribute: 'href', value: 'https://example.com/' },
          ],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })

  test('should not find an input with a specific value', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [
            { event: 'Open', url: '/' },
            { event: 'Fill', input: 'name', value: 'john' },
          ],
          then: [{ expect: 'InputText', input: 'name', value: 'doe' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).rejects.toThrow('INPUT_NOT_FOUND')
  })

  test('should find an input with a specific value', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'display invalid text',
          when: [
            { event: 'Open', url: '/' },
            { event: 'Fill', input: 'name', value: 'john' },
          ],
          then: [{ expect: 'InputText', input: 'name', value: 'john' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })

  test('should submit a form into database', async () => {
    // GIVEN
    const successMessage = 'Form submitted'
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'submit form to database',
          when: [
            { event: 'Open', url: '/' },
            { event: 'Fill', input: 'name', value: 'john' },
            { event: 'Click', text: 'Submit' },
            { event: 'WaitForText', text: successMessage },
          ],
          then: [
            {
              expect: 'Record',
              table: 'leads',
              find: [{ field: 'name', operator: 'is', value: 'john' }],
            },
          ],
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
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    const app = new App()

    // WHEN
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })
})
