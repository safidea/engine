import { test, expect } from '@playwright/test'
import App, { type Config as AppConfig } from '@solumy/engine'
import Page, { type Config as PageConfig } from '@solumy/engine/page'
import Database from '@utils/tests/database'

test.describe('Form component', () => {
  test('should display a form', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const submitButton = {
      type: 'submit',
      label: 'Save',
    }
    const inputs = [
      {
        name: 'email',
        label: 'Your email',
        placeholder: '',
      },
    ]
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Form',
          action: '#',
          title: { text: title },
          paragraph: { text: description },
          inputs,
          buttons: [
            {
              type: 'submit',
              label: 'Save',
            },
          ],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const titleContent = await page.textContent('h4')
    expect(titleContent).toContain(title)

    const descriptionContent = await page.textContent('p')
    expect(descriptionContent).toContain(description)

    const buttonContent = await page.textContent('button')
    expect(buttonContent).toContain(submitButton.label)

    for (const input of inputs) {
      const inputLocator = page.getByLabel(input.label)
      await expect(inputLocator).toBeVisible()
    }
  })

  test('should display a form with a success message', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const submitButton = {
      type: 'submit',
      label: 'Save',
    }
    const inputs = [
      {
        name: 'email',
        label: 'Your email',
        placeholder: '',
      },
    ]
    const successMessage = 'Success message'
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Form',
          action: '#',
          title: { text: title },
          paragraph: { text: description },
          inputs,
          buttons: [
            {
              type: 'submit',
              label: 'Save',
            },
          ],
          successMessage,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const titleContent = await page.textContent('h4')
    expect(titleContent).toContain(title)

    const descriptionContent = await page.textContent('p')
    expect(descriptionContent).toContain(description)

    const buttonContent = await page.textContent('button')
    expect(buttonContent).toContain(submitButton.label)

    for (const input of inputs) {
      const inputLocator = page.getByLabel(input.label)
      await expect(inputLocator).toBeVisible()
    }
  })

  test('should submit a form and create a row in a database', async ({ page }) => {
    // GIVEN
    const database = new Database()
    const successMessage = 'Your lead has been created successfully!'
    const config: AppConfig = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
                  type: 'SingleLineText',
                },
                {
                  name: 'email',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: database.config,
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
      .table('leads')
      .read([{ field: 'email', operator: '=', value: 'test@test.com' }])
    expect(lead).toBeDefined()
  })

  test('should display a success message after submiting a form', async ({ page }) => {
    // GIVEN
    const database = new Database()
    const successMessage = 'Your lead has been created successfully!'
    const config: AppConfig = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
                  type: 'SingleLineText',
                },
                {
                  name: 'email',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: database.config,
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

  test.skip('should submit a form and update a row in a database', async ({ page }) => {
    // GIVEN
    const database = new Database()
    const successMessage = 'Your lead has been updated successfully!'
    const config: AppConfig = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          pages: [
            {
              name: 'Page',
              path: '/:id',
              body: [
                {
                  component: 'Form',
                  title: { text: 'This is a title' },
                  paragraph: { text: 'This is a description' },
                  action: '/api/table/leads/{{ url.params.id }}',
                  source: '/api/table/leads/{{ url.params.id }}',
                  method: 'PATCH',
                  inputs: [
                    {
                      name: 'name',
                      label: 'Your name',
                      defaultValue: '{{ data.name }}',
                    },
                    {
                      name: 'email',
                      label: 'Your email',
                      defaultValue: '{{ data.email }}',
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
                  type: 'SingleLineText',
                },
                {
                  name: 'email',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: database.config,
    }
    const app = new App()
    const url = await app.start(config)
    await database
      .table('leads')
      .insert({ id: '1', name: 'John', email: 'test@test.com', created_at: new Date() })

    // WHEN
    await page.goto(url)
    await page.fill('input[name="name"]', 'John Doe')
    await page.click('button')
    await page.getByText(successMessage).waitFor({ state: 'visible' })

    // THEN
    const lead = await database.table('leads').read([{ field: 'id', operator: '=', value: '1' }])
    expect(lead?.name).toEqual('John Doe')
  })
})
