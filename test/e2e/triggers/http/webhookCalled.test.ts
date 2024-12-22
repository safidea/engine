import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test.describe('WebhookCalled trigger', () => {
  test('should start an automation from webhook call', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'Send email',
          trigger: {
            service: 'Http',
            event: 'WebhookCalled',
            path: 'send-email',
          },
          actions: [],
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
    const { success } = await res.json()
    expect(success).toBeTruthy()
  })
})
