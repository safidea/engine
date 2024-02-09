import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'
import Queue from '@utils/tests/queue'
import Database from '@utils/tests/database'
import Mailbox from '@utils/tests/mailbox'

test.describe('App with automations', () => {
  test('should wait for a job to be completed', async ({ request }) => {
    // GIVEN
    const database = new Database()
    const queue = new Queue(database)
    const mailbox = new Mailbox()
    await mailbox.start()
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
                  from: mailbox.username,
                  to: '{{ trigger.body.email }}',
                  subject: 'New lead',
                  text: 'A new lead has been created!',
                  html: '<p>A new lead has been created!</p>',
                },
              ],
            },
          ],
        },
      ],
      database: {
        url: database.url,
      },
      mailer: {
        host: mailbox.host,
        port: mailbox.port,
        user: mailbox.username,
        pass: mailbox.password,
      },
    }
    const app = new App(config)
    const url = await app.start()

    // WHEN
    const res = await request.post(`${url}/api/automation/send-email`, {
      data: { email: 'test@test.com' },
    })

    // THEN
    expect(res.ok()).toBeTruthy()
    const { id } = await res.json()
    await queue.wait(id)
    const job = await queue.get(id)
    expect(job).toBeDefined()
    expect(job?.state).toBe('completed')
  })

  test('should send an email from a webhook call', async ({ request }) => {
    // GIVEN
    const database = new Database()
    const queue = new Queue(database)
    const mailbox = new Mailbox()
    await mailbox.start()
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
                  from: mailbox.username,
                  to: '{{ trigger.body.email }}',
                  subject: 'New lead',
                  text: 'A new lead has been created!',
                  html: '<p>A new lead has been created!</p>',
                },
              ],
            },
          ],
        },
      ],
      database: {
        url: database.url,
      },
      mailer: {
        host: mailbox.host,
        port: mailbox.port,
        user: mailbox.username,
        pass: mailbox.password,
      },
    }
    const app = new App(config)
    const url = await app.start()

    // WHEN
    const res = await request.post(`${url}/api/automation/send-email`, {
      data: { email: mailbox.username },
    })

    // THEN
    expect(res.ok()).toBeTruthy()
    const { id } = await res.json()
    await queue.wait(id)
    const email = await mailbox.getLastEmail()
    expect(email).toBeDefined()
    expect(email?.to).toBe(mailbox.username)
    expect(email?.subject).toBe('New lead')
    expect(email?.text).toBe('A new lead has been created!')
  })
})
