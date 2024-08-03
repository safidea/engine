import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import { isValidBase64PDF } from '@tests/browser'

test.describe('Create PDF action', () => {
  test('should create a PDF url', async ({ request }) => {
    // GIVEN
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
              action: 'CreatePdf',
              name: 'createPdf',
              input: {
                name: {
                  value: 'John Doe',
                  type: 'string',
                },
              },
              template: 'Hello, {{name}}!',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
      .post(`${url}/api/automation/create-pdf`)
      .then((res) => res.json())

    // THEN
    expect(isValidBase64PDF(response.url)).toBe(true)
  })
})
