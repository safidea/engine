import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'
import Queue from '@utils/tests/queue'
import Database from '@utils/tests/database'

test.describe('App with automations', () => {
  test('should start an automation with a webhook trigger', async ({ request }) => {
    // GIVEN
    const database = new Database()
    const queue = new Queue(database)
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
      database: {
        url: database.url,
      }
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

    await queue.wait(id)
    const job = await queue.get(id)
    expect(job).toBeDefined()
    expect(job?.state).toBe('completed')
  })
})
