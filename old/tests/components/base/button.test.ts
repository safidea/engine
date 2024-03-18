import { test, expect } from '@utils/tests/fixtures'
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

  test('should delete a row when clicked', async ({ page }) => {
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
    await page.locator('[aria-busy="true"]').waitFor({ state: 'hidden' })

    // THEN
    const lead = await database.table('leads').read([{ field: 'id', operator: '=', value: '1' }])
    expect(lead).toBeUndefined()
  })

  test('should redirect after deleting a row successfully when clicked', async ({ page }) => {
    // GIVEN
    const database = new Database()
    const config: AppConfig = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
    await page.getByText('Delete lead').click()

    // THEN
    await expect(page.waitForURL('**/leads')).resolves.toBeUndefined()
  })
})
