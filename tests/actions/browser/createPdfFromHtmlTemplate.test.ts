import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Storage from '@tests/storage'
import Database from '@tests/database'
import pdf from 'pdf-parse-new'

test.describe('Create PDF from HTML template action', () => {
  Database.each(test, (dbConfig) => {
    test('should create a PDF from a .html file', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
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
        .post(`${url}/api/automation/create-pdf`, {
          data: {
            name: 'John Doe',
          },
        })
        .then((res) => res.json())

      // THEN
      const file = await storage.bucket('messages').readById(response.fileId)
      const { text } = await pdf(file?.file_data ?? Buffer.from(''))
      expect(text).toContain('John Doe')
    })

    test('should create a PDF from a .html file with a custom filename', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
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
        .post(`${url}/api/automation/create-pdf`, {
          data: {
            name: 'John Doe',
            filename: 'JohnDoe.pdf',
          },
        })
        .then((res) => res.json())

      // THEN
      const file = await storage.bucket('messages').readById(response.fileId)
      expect(file?.name).toBe('JohnDoe.pdf')
    })
  })
})
