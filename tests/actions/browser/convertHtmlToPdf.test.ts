import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import pdf from 'pdf-parse-new'

test.describe('Convert .html to .pdf', () => {
  test.skip('should convert a .html to a .pdf', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'createPDF',
          trigger: {
            trigger: 'ApiCalled',
            path: 'create-pdf',
            input: {
              name: {
                type: 'string',
              },
            },
            output: {
              fileId: {
                value: '{{createPdf.fileId}}',
                type: 'string',
              },
            },
          },
          actions: [
            {
              service: 'Browser',
              action: 'CreatePdfFromHtmlTemplate',
              name: 'createPdf',
              input: {
                name: {
                  value: '{{trigger.body.name}}',
                  type: 'string',
                },
              },
              templatePath: './tests/__helpers__/docs/template.html',
              fileName: 'JohnDoe.pdf',
              bucket: 'messages',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
      .post(`${url}/api/automation/create-pdf`, {
        data: {
          name: 'John Doe',
        },
      })
      .then((res) => res.json())

    // THEN
    const { text } = await pdf(response.file?.file_data ?? Buffer.from(''))
    expect(text).toContain('John Doe')
  })

  test.skip('should create a PDF from a .html file with a custom filename', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'createPDF',
          trigger: {
            trigger: 'ApiCalled',
            path: 'create-pdf',
            input: {
              name: {
                type: 'string',
              },
              filename: {
                type: 'string',
              },
            },
            output: {
              fileId: {
                value: '{{createPdf.fileId}}',
                type: 'string',
              },
            },
          },
          actions: [
            {
              service: 'Browser',
              action: 'CreatePdfFromHtmlTemplate',
              name: 'createPdf',
              input: {
                name: {
                  value: '{{trigger.body.name}}',
                  type: 'string',
                },
              },
              templatePath: './tests/__helpers__/docs/template.html',
              fileName: '{{trigger.body.filename}}',
              bucket: 'messages',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
      .post(`${url}/api/automation/create-pdf`, {
        data: {
          name: 'John Doe',
          filename: 'JohnDoe.pdf',
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.file?.name).toBe('JohnDoe.pdf')
  })
})
