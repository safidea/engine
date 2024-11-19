import { test, expect, env } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'

test.describe('Get Company action', () => {
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
            input: {
              type: 'object',
              properties: {
                siret: { type: 'string' },
              },
            },
            output: {
              denomination: {
                value: '{{getCompany.denomination}}',
                type: 'string',
              },
            },
          },
          actions: [
            {
              integration: 'Pappers',
              action: 'GetCompany',
              name: 'getCompany',
              siret: '{{trigger.body.siret}}',
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
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const response = await request
      .post(`${url}/api/automation/get-company`, {
        data: {
          siret: '44306184100047',
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.denomination).toBe('GOOGLE FRANCE')
  })
})