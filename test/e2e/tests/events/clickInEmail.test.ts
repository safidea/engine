import { test, expect, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test.slow()

test('should click on a link in a email', async () => {
  // GIVEN
  const config: Config = {
    name: 'App',
    tests: [
      {
        name: 'should click on a link in a email',
        when: [
          {
            event: 'Open',
            url: '/login',
          },
          {
            event: 'Fill',
            input: 'email',
            value: 'test@test.com',
          },
          {
            event: 'Click',
            text: 'Login',
          },
          {
            event: 'WaitForText',
            text: 'Welcome back, John Doe',
          },
          {
            event: 'WaitForAutomation',
            automation: 'send-email',
          },
          {
            event: 'ClickInEmail',
            mailbox: 'test@test.com',
            text: 'Click here to confirm your email',
          },
        ],
        then: [
          {
            expect: 'Url',
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
            buttons: [
              {
                type: 'submit',
                label: 'Login',
              },
            ],
            successMessage: 'Welcome back, John Doe',
          },
        ],
      },
    ],
    automations: [
      {
        name: 'send-email',
        trigger: {
          service: 'Http',
          event: 'WebhookCalled',
          path: 'send-email',
        },
        actions: [
          {
            service: 'Mailer',
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
  const app = new NodeApp()

  // WHEN
  const call = () => app.test(config)

  // THEN
  await expect(call()).resolves.toBeUndefined()
})
