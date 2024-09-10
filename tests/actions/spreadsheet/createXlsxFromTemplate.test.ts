import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import SpreadsheetLoader from '@tests/spreadsheetLoader'
import Storage from '@tests/storage'
import Database from '@tests/database'

test.describe('Fill .xlsx template action', () => {
  Database.each(test, (dbConfig) => {
    test('should fill a .xlsx template', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
      const spreadsheetLoader = new SpreadsheetLoader()
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'createSpreadsheet',
            trigger: {
              event: 'ApiCalled',
              path: 'create-spreadsheet',
              input: {
                name: {
                  type: 'string',
                },
              },
              output: {
                fileId: {
                  value: '{{createSpreadsheet.file.id}}',
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
        database: dbConfig,
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
      const file = await storage.bucket('messages').readById(response.fileId)
      const spreadsheet = await spreadsheetLoader.fromXlsxBuffer(file?.data ?? Buffer.from(''))
      const cell = spreadsheet.readTextCells().find(({ value }) => value.includes('John Doe'))
      expect(cell).toBeDefined()
    })
  })
})
