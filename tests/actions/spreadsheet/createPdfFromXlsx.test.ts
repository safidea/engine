import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Convert .xlsx to .html', () => {
  test.skip('should convert a .xlsx to a .html', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'createHtml',
          trigger: {
            event: 'ApiCalled',
            path: 'create-html',
            input: {
              spreadsheetFileId: {
                type: 'string',
              },
            },
            output: {
              file: {
                value: '{{createHtml.file}}',
                type: 'object',
              },
            },
          },
          actions: [
            {
              service: 'Spreadsheet',
              action: 'CreatePdfFromXlsx',
              name: 'createHtml',
              xlsxBucket: 'documents',
              xlsxFileId: '{{trigger.body.spreadsheetFileId}}',
              pdfFileName: 'output.pdf',
              pdfBucket: 'documents',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
      .post(`${url}/api/automation/create-html`)
      .then((res) => res.json())

    // THEN
    const html = response.file?.data.toString()
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('Hello')
  })
})
