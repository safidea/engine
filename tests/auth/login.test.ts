import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'

test.describe('Auth login', () => {
  test('should login from magic-link provider', async () => {
    // GIVEN
    const config: Config = {
      name: 'Request',
      features: [
        {
          name: 'login',
          specs: [
            {
              name: 'should submit the login form',
              when: [
                {
                  open: '/login',
                },
                {
                  fill: 'email',
                  value: 'test@test.com',
                },
                {
                  click: 'Send magic link',
                },
                {
                  waitForText: 'Your email has been sent.',
                },
                {
                  mailbox: 'test@test.com',
                  find: [
                    {
                      field: 'subject',
                      operator: 'is',
                      value: 'Confirm your email',
                    },
                  ],
                  click: 'Confirm my email',
                },
              ],
              then: [
                {
                  url: '/dashboard',
                },
              ],
            },
          ],
          pages: [
            {
              name: 'login',
              path: '/login',
              head: {
                title: 'Login',
              },
              body: [
                {
                  component: 'Form',
                  action: '/api/auth/login',
                  method: 'POST',
                  title: { text: 'Login' },
                  inputs: [
                    {
                      name: 'email',
                      label: 'Email',
                      type: 'email',
                      required: true,
                      placeholder: 'My email',
                    },
                  ],
                  buttons: [
                    {
                      type: 'submit',
                      label: 'Send magic link',
                    },
                  ],
                  successMessage: 'Your email has been sent.',
                },
              ],
            },
          ],
        },
      ],
      auth: {
        redirectOnLogin: '/dashboard',
        redirectOnLogout: '/login',
        strategy: 'magic-link',
        confirmEmail: {
          subject: 'Confirm your email',
          text: 'Click on the link to confirm your email: {{{ link }}}.',
          html: 'Click on the link to confirm your email: <a href="{{{ link }}}">Confirm my email</a>.',
        },
        secret: 'secret',
      },
    }
    const app = new App()

    // WHEN
    const errors = await app.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })
})
