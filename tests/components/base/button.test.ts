import { test, expect } from '@playwright/test'
import App, { type Config as AppConfig } from '@solumy/engine'
import Page, { type Config as PageConfig } from '@solumy/engine/page'
import Database from '@utils/tests/database'

test.describe('Button component', () => {
  test('should render a button', async ({ page }) => {
    // GIVEN
    const label = 'Button'
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Button',
          label,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const buttonContent = await page.textContent('button')
    expect(buttonContent).toContain(label)
  })

  test('should render a button with a link', async ({ page }) => {
    // GIVEN
    const label = 'Button'
    const href = 'https://example.com/'
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Button',
          label,
          href,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const button = page.locator('a', { hasText: label })
    expect(await button.getAttribute('href')).toContain(href)
  })

  test.skip('should delete a row when clicked', async ({ page }) => {
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
              path: '/:id',
              body: [
                {
                  component: 'Button',
                  type: 'submit',
                  label: 'Delete Request',
                  action: '/api/table/requests/{{ params.id }}',
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
    await page.goto(url + '/1')
    await page.click('button')
    await page.getByText('Delete Request').waitFor({ state: 'visible' })

    // THEN
    const lead = await database.table('leads').read([{ field: 'id', operator: '=', value: '1' }])
    expect(lead).toBeUndefined()
  })
})
