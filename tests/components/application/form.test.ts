import { test, expect } from '@playwright/test'
import { createApp, type IApp } from '@solumy/engine'
import { createPage, type IPage } from '@solumy/engine/page'

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
    const config: IPage = {
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
    const { page: pageEngine } = await createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

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
    const config: IPage = {
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
    const { page: pageEngine } = await createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

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
    const config: IApp = {
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
    }
    const { app } = await createApp(config)
    const url = await app!.start()

    // WHEN
    await page.goto(url)
    await page.fill('input[name="name"]', 'John')
    await page.fill('input[name="email"]', 'test@test.com')
    await page.click('button')

    // THEN
    const lead = await app!.database!.table('leads').find({ email: 'test@test.com' })
    expect(lead).toBeDefined()
  })
})
