import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Auth', () => {
  test.slow()

  test('should login from magic-link provider', async () => {
    // GIVEN
    const config: Config = {
      name: 'Request',
      tests: [
        {
          name: 'should submit the login form',
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
              text: 'Send magic link',
            },
            {
              event: 'WaitForText',
              text: 'Your email has been sent.',
            },
            {
              event: 'ClickInEmail',
              mailbox: 'test@test.com',
              find: [
                {
                  field: 'subject',
                  operator: 'is',
                  value: 'Confirm your email',
                },
              ],
              text: 'Confirm my email',
            },
          ],
          then: [
            {
              expect: 'Url',
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
      auth: {
        redirectOnLogin: '/dashboard',
        redirectOnLogout: '/login',
        strategy: 'magic-link',
        confirmEmail: {
          from: 'noreply@safidea.com',
          subject: 'Confirm your email',
          text: 'Click on the link to confirm your email: {{{ link }}}.',
          html: 'Click on the link to confirm your email: <a href="{{{ link }}}">Confirm my email</a>.',
        },
        secret: 'secret',
      },
    }
    const app = new App()

    // WHEN
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })
})
