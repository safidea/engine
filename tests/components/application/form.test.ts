import { test, expect } from '@playwright/test'
import App, { type Config as AppConfig } from '@solumy/engine'
import Page, { type Config as PageConfig } from '@solumy/engine/page'
import { Database } from '@utils/tests/database'

test.describe('Form component', () => {
  test('should display a form', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const submitButton = {
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
          title,
          description,
          inputs,
          submitButton,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page(config)
    const html = pageEngine.getHtml()
    await page.setContent(html)

    // THEN
    const titleContent = await page.textContent('h2')
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
          title,
          description,
          inputs,
          submitButton,
          successMessage,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page(config)
    const html = pageEngine.getHtml()
    await page.setContent(html)

    // THEN
    const titleContent = await page.textContent('h2')
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

  test.skip('should submit a form into database', async ({ page }) => {
    // GIVEN
    const database = new Database()
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
                  title: 'This is a title',
                  description: 'This is a description',
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
                  submitButton: {
                    label: 'Save',
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
                {
                  name: 'email',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: {
        url: database.url,
      },
    }
    const app = new App(config)
    const url = await app.start()

    // WHEN
    await page.goto(url)
    await page.fill('input[name="name"]', 'John')
    await page.fill('input[name="email"]', 'test@test.com')
    await page.click('button')

    // THEN
    const lead = await database
      .table('leads')
      .read([{ field: 'email', operator: '=', value: 'test@test.com' }])
    expect(lead).toBeDefined()
  })
})
