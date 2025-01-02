import { test, expect, NodeApp } from '@test/fixtures'
import { type Config } from '@latechforce/engine'

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
        from: 'noreply@latechforce.com',
        subject: 'Confirm your email',
        text: 'Click on the link to confirm your email: {{{ link }}}.',
        html: 'Click on the link to confirm your email: <a href="{{{ link }}}">Confirm my email</a>.',
      },
      secret: 'secret',
    },
  }
  const app = new NodeApp()

  // WHEN
  const call = () => app.test(config)

  // THEN
  await expect(call()).resolves.toBeUndefined()
})
