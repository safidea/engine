import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import { isValidBase64PDF } from '@tests/browser'

test.describe.skip('Create PDF action', () => {
  test('should create a PDF from a .html template', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'createPDF',
          trigger: {
            trigger: 'ApiCalled',
            path: 'create-pdf',
            output: {
              url: {
                value: '{{{createPdf.url}}}',
                type: 'string',
              },
            },
          },
          actions: [
            {
              action: 'CreatePdf',
              name: 'createPdf',
              input: {
                name: {
                  value: 'John Doe',
                  type: 'string',
                },
              },
              templatePath: 'docs/template.html',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
      .post(`${url}/api/automation/create-pdf`)
      .then((res) => res.json())

    // THEN
    expect(isValidBase64PDF(response.url)).toBe(true)
  })

  test('should create a PDF from a .docx template', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'createPDF',
          trigger: {
            trigger: 'ApiCalled',
            path: 'create-pdf',
            output: {
              url: {
                value: '{{{createPdf.url}}}',
                type: 'string',
              },
            },
          },
          actions: [
            {
              action: 'CreatePdf',
              name: 'createPdf',
              input: {
                name: {
                  value: 'John Doe',
                  type: 'string',
                },
              },
              templatePath: 'docs/template.docx',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
      .post(`${url}/api/automation/create-pdf`)
      .then((res) => res.json())

    // THEN
    expect(isValidBase64PDF(response.url)).toBe(true)
  })
})
