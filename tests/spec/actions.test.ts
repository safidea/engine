import { test, expect } from '@playwright/test'
import Feature, { type Config } from '@solumy/engine/feature'

test.describe('Spec actions', () => {
  test('should click on a link in a email', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      specs: [
        {
          name: 'should click on a link in a email',
          when: [
            {
              open: '/login',
            },
            {
              fill: 'email',
              value: 'test@test.com',
            },
            {
              click: 'Login',
            },
            {
              waitForText: 'Welcome back, John Doe',
            },
            {
              waitForAutomation: 'send-email',
            },
            {
              mailbox: 'test@test.com',
              find: [
                {
                  field: 'subject',
                  operator: 'is',
                  value: 'Welcome to the app',
                },
              ],
              click: 'Click here to confirm your email',
            },
          ],
          then: [
            {
              url: '/confirm-email',
            },
          ],
        },
      ],
      pages: [
        {
          name: 'Login',
          path: '/login',
          body: [
            {
              component: 'Form',
              action: '/api/automation/send-email',
              method: 'POST',
              inputs: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                },
              ],
              submitButton: {
                label: 'Login',
              },
              successMessage: 'Welcome back, John Doe',
            },
          ],
        },
      ],
      automations: [
        {
          name: 'send-email',
          trigger: {
            event: 'WebhookCalled',
            path: 'send-email',
            method: 'POST',
          },
          actions: [
            {
              action: 'SendEmail',
              name: 'send-email',
              to: '{{ trigger.body.email }}',
              from: 'noreply@test.com',
              subject: 'Welcome to the app',
              text: 'Click here to confirm your email',
              html: '<a href="/confirm-email">Click here to confirm your email</a>',
            },
          ],
        },
      ],
    }
    const feature = new Feature()

    // WHEN
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })
})
