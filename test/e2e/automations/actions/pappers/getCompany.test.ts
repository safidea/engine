import { test, expect, env, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test('should get a company', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'getCompany',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'get-company',
          output: {
            denomination: '{{getCompany.denomination}}',
          },
        },
        actions: [
          {
            name: 'getCompany',
            integration: 'Pappers',
            action: 'GetCompany',
            siret: '44306184100047',
          },
        ],
      },
    ],
    integrations: {
      pappers: {
        apiKey: env.TEST_PAPPERS_API_KEY,
      },
    },
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/get-company`).then((res) => res.json())

  // THEN
  expect(response.denomination).toBe('GOOGLE FRANCE')
})
