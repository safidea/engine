import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Queue from '@tests/queue'
import Database from '@tests/database'
import Mailer from '@tests/mailer'

test.describe('App with automations', () => {
  test('should wait for a job to be completed', async ({ request }) => {
    // GIVEN
    const database = new Database()
    const queue = new Queue(database)
    const mailer = new Mailer(database)
    const config: Config = {
      name: 'App',
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
              from: 'noreply@test.com',
              to: '{{ trigger.body.email }}',
              subject: 'New lead',
              text: 'A new lead has been created!',
              html: '<p>A new lead has been created!</p>',
            },
          ],
        },
      ],
      database: database.config,
      mailer: mailer.config,
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const res = await request.post(`${url}/api/automation/send-email`, {
      data: { email: 'test@test.com' },
    })

    // THEN
    expect(res.ok()).toBeTruthy()
    const { id } = await res.json()
    await queue.waitFor({ id, state: 'completed' })
    const job = await queue.getById(id)
    expect(job).toBeDefined()
    expect(job?.state).toBe('completed')
  })

  test('should send an email from a webhook call', async ({ request }) => {
    // GIVEN
    const database = new Database()
    const queue = new Queue(database)
    const mailer = new Mailer(database)
    const config: Config = {
      name: 'App',
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
              from: 'noreply@test.com',
              to: '{{ trigger.body.email }}',
              subject: 'New lead',
              text: 'A new lead has been created!',
              html: '<p>A new lead has been created!</p>',
            },
          ],
        },
      ],
      database: database.config,
      mailer: mailer.config,
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const res = await request.post(`${url}/api/automation/send-email`, {
      data: { email: 'test@test.com' },
    })

    // THEN
    expect(res.ok()).toBeTruthy()
    const { id } = await res.json()
    await queue.waitFor({ id, state: 'completed' })
    const email = await mailer.find([{ field: 'subject', operator: '=', value: 'New lead' }])
    expect(email).toBeDefined()
    expect(email?.to).toBe('test@test.com')
    expect(email?.subject).toBe('New lead')
    expect(email?.text).toBe('A new lead has been created!')
  })
})
