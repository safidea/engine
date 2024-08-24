import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Storage from '@tests/storage'
import Database from '@tests/database'
import mammoth from 'mammoth'

test.describe('Create spreadsheet from template action', () => {
  Database.each(test, (dbConfig) => {
    test.skip('should create a spreadsheet from a .xlsx file', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
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
                action: 'CreateFromTemplate',
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
      const { value } = await mammoth.extractRawText({ buffer: file?.file_data ?? Buffer.from('') })
      expect(value).toContain('John Doe')
    })
  })
})
