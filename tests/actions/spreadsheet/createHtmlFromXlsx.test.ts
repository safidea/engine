import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Storage from '@tests/storage'
import Database from '@tests/database'

test.describe('Create .html from .xlsx', () => {
  Database.each(test, (dbConfig) => {
    test.skip('should create a .html file from .xlsx', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
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
        buckets: [
          {
            name: 'documents',
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const { response } = await request
        .post(`${url}/api/automation/create-html`)
        .then((res) => res.json())

      // THEN
      const file = await storage.bucket('documents').readById(response.fileId)
      const html = file?.file_data.toString()
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Hello')
    })
  })
})
