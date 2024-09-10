import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'
import Storage from '@tests/storage'
import SpreadsheetLoader from '@tests/spreadsheetLoader'
import { readPdfText } from 'pdf-text-reader'

test.describe('Create .pdf from .xlsx', () => {
  Database.each(test, (dbConfig) => {
    test('should create a .pdf from .xlsx', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
      const spreadsheetLoader = new SpreadsheetLoader()
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'createHtml',
            trigger: {
              event: 'ApiCalled',
              path: 'create-pdf',
              input: {
                spreadsheetFileId: {
                  type: 'string',
                },
              },
              output: {
                fileId: {
                  value: '{{createPdf.file.id}}',
                  type: 'string',
                },
              },
            },
            actions: [
              {
                service: 'Spreadsheet',
                action: 'CreatePdfFromXlsx',
                name: 'createPdf',
                xlsxBucket: 'documents',
                xlsxFileId: '{{trigger.body.spreadsheetFileId}}',
                pdfFileName: 'output.pdf',
                pdfBucket: 'documents',
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
      const spreadsheet = await spreadsheetLoader.fromXlsxFile(
        './tests/__helpers__/docs/template.xlsx'
      )
      await storage.bucket('documents').save({
        id: '1',
        name: 'input.xlsx',
        data: await spreadsheet.toBuffer(),
        created_at: new Date(),
      })

      // WHEN
      const { response } = await request
        .post(`${url}/api/automation/create-pdf`, {
          data: {
            spreadsheetFileId: '1',
          },
        })
        .then((res) => res.json())

      // THEN
      const file = await storage.bucket('documents').readById(response.fileId)
      const text = await readPdfText({ data: new Uint8Array(file?.data ?? Buffer.from('')) })
      expect(text).toContain('Hello')
    })
  })
})
