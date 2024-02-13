import { test, expect } from '@playwright/test'
import Feature, { type Config } from '@solumy/engine/feature'
import Mailbox from '@utils/tests/mailbox'

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
              findOne: [
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
    const feature = new Feature()
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })

  test.skip('should find an email in mailbox', async () => {
    // GIVEN
    const mailbox = new Mailbox()
    await mailbox.start()
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'send an email',
          when: [
            { post: '/api/automation/send-email', body: { email: mailbox.username } },
            { waitForAutomation: 'send-email' },
          ],
          then: [
            {
              mailbox: mailbox.username,
              findOne: {
                subject: 'New email',
              },
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
              from: mailbox.username,
              subject: 'New email',
              text: 'You have a new email!',
              html: '<p>You have a new email!</p>',
            },
          ],
        },
      ],
    }

    // WHEN
    const feature = new Feature()
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })
})
