import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('WebhookCalled trigger', () => {
  test('should start an automation', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          automations: [
            {
              name: 'Send email',
              trigger: {
                event: 'WebhookCalled',
                method: 'POST',
                path: 'send-email',
              },
              actions: [],
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const res = await request.post(`${url}/api/automation/send-email`, {
      data: { email: 'test@test.com' },
    })

    // THEN
    expect(res.ok()).toBeTruthy()
    const { success, id } = await res.json()
    expect(success).toBeTruthy()
    expect(id).toBeDefined()
  })
})
