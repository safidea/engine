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
            trigger: 'ApiCalled',
            path: 'create-html',
            input: {
              spreadsheetFileId: {
                type: 'string',
              },
            },
            output: {
              fileId: {
                value: '{{createHtml.fileId}}',
                type: 'string',
              },
            },
          },
          actions: [
            {
              service: 'Spreadsheet',
              action: 'CreateHtmlFromXlsx',
              name: 'createHtml',
              spreadsheetBucket: 'documents',
              spreadsheetFileId: '{{trigger.body.spreadsheetFileId}}',
              fileName: 'output.html',
              bucket: 'documents',
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
    const html = response.file?.file_data.toString()
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('Hello')
  })
})
