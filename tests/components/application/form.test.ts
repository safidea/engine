import { test, expect } from '@playwright/test'
import { createPage, type IPage } from '@solumy/engine/page'

test.describe('Form component', () => {
  test('should render a form', async ({ page }) => {
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
})
