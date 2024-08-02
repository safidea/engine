import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('Form component', () => {
  test('should display a form', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Form',
              action: '#',
              title: { text: 'This is a title' },
              paragraph: { text: 'This is a description' },
              inputs: [
                {
                  name: 'email',
                  label: 'Your email',
                  placeholder: '',
                },
              ],
              buttons: [
                {
                  type: 'submit',
                  label: 'Save',
                },
              ],
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
    await expect(page.locator('[data-component="Form"]')).toBeVisible()
  })

  Database.each(test, (dbConfig) => {
    test('should submit a form and create a row in a database', async ({ page }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const successMessage = 'Your lead has been created successfully!'
      const config: Config = {
        name: 'App',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Form',
                title: { text: 'This is a title' },
                paragraph: { text: 'This is a description' },
                action: '/api/table/leads',
                method: 'POST',
                inputs: [
                  {
                    name: 'name',
                    label: 'Your name',
                  },
                  {
                    name: 'email',
                    label: 'Your email',
                  },
                ],
                buttons: [
                  {
                    type: 'submit',
                    label: 'Save',
                  },
                ],
                successMessage,
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

      // WHEN
      await page.goto(url)
      await page.fill('input[name="name"]', 'John')
      await page.fill('input[name="email"]', 'test@test.com')
      await page.click('button')
      await page.getByText(successMessage).waitFor({ state: 'visible' })

      // THEN
      const lead = await database
        .table('leads', [
          {
            name: 'email',
            type: 'TEXT',
          },
        ])
        .read([{ field: 'email', operator: '=', value: 'test@test.com' }])
      expect(lead).toBeDefined()
    })

    test('should display a success message after submiting a form', async ({ page }) => {
      // GIVEN
      const successMessage = 'Your lead has been created successfully!'
      const config: Config = {
        name: 'App',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Form',
                title: { text: 'This is a title' },
                paragraph: { text: 'This is a description' },
                action: '/api/table/leads',
                method: 'POST',
                inputs: [
                  {
                    name: 'name',
                    label: 'Your name',
                  },
                  {
                    name: 'email',
                    label: 'Your email',
                  },
                ],
                buttons: [
                  {
                    type: 'submit',
                    label: 'Save',
                    variant: 'secondary',
                  },
                ],
                successMessage,
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

      // WHEN
      await page.goto(url)
      await page.fill('input[name="name"]', 'John')
      await page.fill('input[name="email"]', 'test@test.com')
      await page.click('button')

      // THEN
      await expect(page.getByText(successMessage)).toBeVisible()
    })

    test('should submit a form and update a row in a table', async ({ page }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const successMessage = 'Your lead has been updated successfully!'
      const config: Config = {
        name: 'App',
        pages: [
          {
            name: 'Page',
            path: '/:id',
            body: [
              {
                component: 'Form',
                title: { text: 'This is a title' },
                paragraph: { text: 'This is a description' },
                action: '/api/table/leads/{{ params.id }}',
                source: '/api/table/leads/{{ params.id }}',
                method: 'PATCH',
                inputs: [
                  {
                    name: 'name',
                    label: 'Your name',
                  },
                  {
                    name: 'email',
                    label: 'Your email',
                  },
                ],
                buttons: [
                  {
                    type: 'submit',
                    label: 'Update',
                  },
                ],
                successMessage,
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
      await page.fill('input[name="name"]', 'John Doe')
      await page.click('button')
      await page.getByText(successMessage).waitFor({ state: 'visible' })

      // THEN
      const lead = await leads.read([{ field: 'id', operator: '=', value: '1' }])
      expect(lead?.name).toEqual('John Doe')
      expect(lead?.email).toEqual('test@test.com')
    })

    test('should submit a form and update a specific row in a table with rows', async ({
      page,
    }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const successMessage = 'Your lead has been updated successfully!'
      const config: Config = {
        name: 'App',
        pages: [
          {
            name: 'Page',
            path: '/:id',
            body: [
              {
                component: 'Form',
                title: { text: 'This is a title' },
                paragraph: { text: 'This is a description' },
                action: '/api/table/leads/{{ params.id }}',
                source: '/api/table/leads/{{ params.id }}',
                method: 'PATCH',
                inputs: [
                  {
                    name: 'name',
                    label: 'Your name',
                  },
                  {
                    name: 'email',
                    label: 'Your email',
                  },
                ],
                buttons: [
                  {
                    type: 'submit',
                    label: 'Update',
                  },
                ],
                successMessage,
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
      await leads.insertMany([
        { id: '1', name: 'John 1', email: 'test1@test.com', created_at: new Date() },
        { id: '2', name: 'John 2', email: 'test2@test.com', created_at: new Date() },
        { id: '3', name: 'John 3', email: 'test3@test.com', created_at: new Date() },
      ])

      // WHEN
      await page.goto(url + '/2')
      await page.fill('input[name="name"]', 'John Doe')
      await page.click('button')
      await page.getByText(successMessage).waitFor({ state: 'visible' })

      // THEN
      const lead = await leads.read([{ field: 'id', operator: '=', value: '2' }])
      expect(lead?.name).toEqual('John Doe')
      expect(lead?.email).toEqual('test2@test.com')
    })

    test('should delete a row from a form button', async ({ page }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const successMessage = 'Your lead has been updated successfully!'
      const config: Config = {
        name: 'App',
        pages: [
          {
            name: 'Home',
            path: '/',
            body: [],
          },
          {
            name: 'Lead',
            path: '/:id',
            body: [
              {
                component: 'Form',
                title: { text: 'This is a title' },
                paragraph: { text: 'This is a description' },
                action: '/api/table/leads/{{ params.id }}',
                source: '/api/table/leads/{{ params.id }}',
                method: 'PATCH',
                inputs: [
                  {
                    name: 'name',
                    label: 'Your name',
                  },
                  {
                    name: 'email',
                    label: 'Your email',
                  },
                ],
                buttons: [
                  {
                    type: 'submit',
                    label: 'Delete Request',
                    action: '/api/table/leads/{{ params.id }}',
                    method: 'DELETE',
                    onSuccess: {
                      redirect: '/',
                    },
                  },
                  {
                    type: 'submit',
                    label: 'Update',
                  },
                ],
                successMessage,
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
      await leads.insert({
        id: '1',
        name: 'John 1',
        email: 'test1@test.com',
        created_at: new Date(),
      })

      // WHEN
      await page.goto(url + '/1')
      await page.getByText('Delete Request').click()
      await page.waitForURL(url + '/')

      // THEN
      const lead = await leads.read([{ field: 'id', operator: '=', value: '1' }])
      expect(lead).toBeUndefined()
    })
  })

  test('should display the form id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Form',
              id: 'my-form',
              action: '#',
              title: { text: 'This is a title' },
              paragraph: { text: 'This is a description' },
              inputs: [
                {
                  name: 'email',
                  label: 'Your email',
                  placeholder: '',
                },
              ],
              buttons: [
                {
                  type: 'submit',
                  label: 'Save',
                },
              ],
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
    const form = page.locator('#my-form')
    await expect(form).toBeVisible()
  })
})
