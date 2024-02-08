import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'

test.describe.only('WebhookCalled trigger', () => {
  test('should start an automation with a webhook trigger', async ({ request }) => {
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
              actions: [
                {
                  name: 'send-email',
                  action: 'SendEmail',
                  to: '{{trigger.email}}',
                  subject: 'New lead',
                  body: 'A new lead has been created!',
                },
              ],
            },
          ],
        },
      ],
    }
    const app = new App(config)
    const url = await app.start()

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
