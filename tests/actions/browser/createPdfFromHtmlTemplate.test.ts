import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Storage from '@tests/storage'
import Database from '@tests/database'

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
              output: {
                fileId: {
                  value: '{{{createPdf.fileId}}}',
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
                    value: 'John Doe',
                    type: 'string',
                  },
                },
                templatePath: './tests/__helpers__/docs/template.html',
                fileName: 'JohnDoe.pdf',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const { response } = await request
        .post(`${url}/api/automation/create-pdf`)
        .then((res) => res.json())

      // THEN
      const file = await storage.readById(response.fileId)
      expect(file).toBeDefined()
      expect(file?.name).toBe('JohnDoe.pdf')
    })
  })
})
