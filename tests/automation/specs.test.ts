import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Automations specs', () => {
  test('should wait for an automation', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'create a row',
          when: [
            { post: '/api/automation/new-lead', body: { name: 'John' } },
            { waitForAutomation: 'New lead' },
          ],
          then: [
            {
              table: 'leads',
              find: [
                {
                  field: 'name',
                  operator: 'is',
                  value: 'John',
                },
              ],
            },
          ],
        },
      ],
      automations: [
        {
          name: 'New lead',
          trigger: {
            event: 'WebhookCalled',
            method: 'POST',
            path: 'new-lead',
          },
          actions: [
            {
              name: 'create-lead',
              action: 'CreateRecord',
              table: 'leads',
              fields: {
                name: '{{ trigger.body.name }}',
              },
            },
          ],
        },
      ],
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'name',
              type: 'SingleLineText',
            },
          ],
        },
      ],
    }

    // WHEN
    const app = new App()
    const errors = await app.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should find an email in mailbox', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'send an email',
          when: [
            { post: '/api/automation/send-email', body: { email: 'test@test.com' } },
            { waitForAutomation: 'send-email' },
          ],
          then: [
            {
              mailbox: 'test@test.com',
              find: [
                {
                  field: 'subject',
                  operator: 'is',
                  value: 'New email',
                },
              ],
            },
          ],
        },
      ],
      automations: [
        {
          name: 'send-email',
          trigger: {
            event: 'WebhookCalled',
            method: 'POST',
            path: 'send-email',
          },
          actions: [
            {
              name: 'send-email',
              action: 'SendEmail',
              to: '{{ trigger.body.email }}',
              from: 'noreply@test.com',
              subject: 'New email',
              text: 'You have a new email!',
              html: '<p>You have a new email!</p>',
            },
          ],
        },
      ],
    }

    // WHEN
    const app = new App()
    const errors = await app.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })
})
