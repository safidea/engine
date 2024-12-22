import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'
import Database from '@test/drivers/database'
import Storage from '@test/drivers/storage'
import SpreadsheetLoader from '@test/drivers/spreadsheetLoader'
import { PdfReader } from 'pdfreader'

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
              service: 'Http',
              event: 'ApiCalled',
              path: 'create-pdf',
              input: {
                type: 'object',
                properties: {
                  spreadsheetFileId: {
                    type: 'string',
                  },
                },
              },
              output: {
                fileId: '{{createPdf.file.id}}',
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
        './test/__helpers__/docs/template.xlsx'
      )
      await storage.bucket('documents').save({
        id: '1',
        name: 'input.xlsx',
        data: await spreadsheet.toBuffer(),
        created_at: new Date(),
      })

      // WHEN
      const response = await request
        .post(`${url}/api/automation/create-pdf`, {
          data: {
            spreadsheetFileId: '1',
          },
        })
        .then((res) => res.json())

      // THEN
      const file = await storage.bucket('documents').readById(response.fileId)
      let text = ''
      await new Promise((resolve) =>
        new PdfReader().parseBuffer(file?.data ?? Buffer.from(''), (err, item) => {
          if (item) text += item.text
          else resolve(true)
        })
      )
      expect(text).toContain('Hello')
    })
  })
})
