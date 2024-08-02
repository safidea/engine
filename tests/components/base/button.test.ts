import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('Button component', () => {
  test('should render a button', async ({ page }) => {
    // GIVEN
    const label = 'Button'
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Button',
              label,
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const buttonContent = await page.textContent('button')
    expect(buttonContent).toContain(label)
  })

  test('should render a button with a link', async ({ page }) => {
    // GIVEN
    const label = 'Button'
    const href = 'https://example.com/'
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Button',
              label,
              href,
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const button = page.locator('a', { hasText: label })
    expect(await button.getAttribute('href')).toContain(href)
  })

  Database.each(test, (dbConfig) => {
    test('should delete a row when clicked', async ({ page }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        pages: [
          {
            name: 'Page',
            path: '/:id',
            body: [
              {
                component: 'Button',
                type: 'submit',
                label: 'Delete Request',
                action: '/api/table/leads/{{ params.id }}',
                method: 'DELETE',
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
                field: 'SingleLineText',
              },
              {
                name: 'email',
                field: 'SingleLineText',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)
      const leads = database.table('leads', [
        {
          name: 'email',
          type: 'TEXT',
        },
      ])
      await leads.insert({ id: '1', name: 'John', email: 'test@test.com', created_at: new Date() })

      // WHEN
      await page.goto(url + '/1')
      await page.click('button')
      await page.locator('[aria-busy="true"]').waitFor({ state: 'hidden' })

      // THEN
      const lead = await leads.read([{ field: 'id', operator: '=', value: '1' }])
      expect(lead).toBeUndefined()
    })

    test('should redirect after deleting a row successfully when clicked', async ({ page }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        pages: [
          {
            name: 'Leads',
            path: '/leads',
            body: [
              {
                component: 'Title',
                text: 'My leads',
              },
            ],
          },
          {
            name: 'Page',
            path: '/:id',
            body: [
              {
                component: 'Button',
                type: 'submit',
                label: 'Delete lead',
                action: '/api/table/leads/{{ params.id }}',
                method: 'DELETE',
                onSuccess: {
                  redirect: '/leads',
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
                field: 'SingleLineText',
              },
              {
                name: 'email',
                field: 'SingleLineText',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)
      await database
        .table('leads', [
          {
            name: 'email',
            type: 'TEXT',
          },
        ])
        .insert({ id: '1', name: 'John', email: 'test@test.com', created_at: new Date() })

      // WHEN
      await page.goto(url + '/1')
      await page.getByText('Delete lead').click()

      // THEN
      await expect(page.waitForURL('**/leads')).resolves.toBeUndefined()
    })
  })

  test('should display the button id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Button',
              label: 'hello world',
              id: 'my-button',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const button = page.getByText('hello world')
    await expect(button).toHaveAttribute('id')
    expect(await button.getAttribute('id')).toBe('my-button')
  })
})
