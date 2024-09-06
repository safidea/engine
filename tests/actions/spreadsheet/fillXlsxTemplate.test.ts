import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Excel from '@tests/excel'

test.describe('Fill .xlsx template action', () => {
  test.skip('should fill a .xlsx template', async ({ request }) => {
    // GIVEN
    const excel = new Excel()
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'createSpreadsheet',
          trigger: {
            trigger: 'ApiCalled',
            path: 'create-spreadsheet',
            input: {
              name: {
                type: 'string',
              },
            },
            output: {
              fileId: {
                value: '{{createSpreadsheet.fileId}}',
                type: 'string',
              },
            },
          },
          actions: [
            {
              service: 'Spreadsheet',
              action: 'CreateXlsxFromTemplate',
              name: 'createSpreadsheet',
              input: {
                name: {
                  value: '{{trigger.body.name}}',
                  type: 'string',
                },
              },
              templatePath: './tests/__helpers__/docs/template.xlsx',
              fileName: 'output.xlsx',
              bucket: 'messages',
            },
          ],
        },
      ],
      buckets: [
        {
          name: 'messages',
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
      .post(`${url}/api/automation/create-spreadsheet`, {
        data: {
          name: 'John Doe',
        },
      })
      .then((res) => res.json())

    // THEN
    const workbook = await excel.workbookFromBuffer(response.file?.file_data ?? Buffer.from(''))
    const cell = workbook.readTextCells().find(({ value }) => value.includes('John Doe'))
    expect(cell).toBeDefined()
  })
})
