import { test, expect, NodeApp } from '@test/fixtures'
import { type Config } from '@latechforce/engine'
// import Database from '@test/drivers/database'

test('should render a button with id', async ({ page }) => {
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
            id: 'my-button',
            label,
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  const button = page.locator('button', { hasText: label })
  expect(await button.getAttribute('id')).toContain('my-button')
  expect(await page.screenshot()).toMatchSnapshot()
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
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  const button = page.locator('a', { hasText: label })
  expect(await button.getAttribute('href')).toContain(href)
  expect(await page.screenshot()).toMatchSnapshot()
})

/*

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
    const app = new NodeApp()
    const { url } = await app.start(config)
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
    const lead = await leads.read({ field: 'id', operator: 'Is', value: '1' })
    expect(lead).toBeUndefined()
    expect(await page.screenshot()).toMatchSnapshot()
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
    const app = new NodeApp()
    const { url } = await app.start(config)
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
    await expect(page.waitForURL('**\/leads')).resolves.toBeUndefined()
    expect(await page.screenshot()).toMatchSnapshot()
  })
})

*/
