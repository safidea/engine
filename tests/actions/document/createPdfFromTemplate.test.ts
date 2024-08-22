import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Storage from '@tests/storage'
import Database from '@tests/database'

test.describe.skip('Create PDF action', () => {
  Database.each(test, (dbConfig) => {
    test('should create a PDF from a .docx template', async ({ request }) => {
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
                url: {
                  value: '{{{createPdf.url}}}',
                  type: 'string',
                },
              },
            },
            actions: [
              {
                service: 'Document',
                action: 'CreatePdfFromTemplate',
                name: 'createPdf',
                input: {
                  name: {
                    value: 'John Doe',
                    type: 'string',
                  },
                },
                templatePath: 'docs/template.docx',
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
    })
  })
})
