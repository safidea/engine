import { test, expect } from '@tests/fixtures'
import Database from '@tests/database'
import App, { type App as Config } from '@safidea/engine'

test.describe('Number text field', () => {
  test('should create a record with a number field through a form', async ({ page }) => {
    // GIVEN
    const database = new Database()
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Add a score',
          path: '/',
          body: [
            {
              component: 'Form',
              title: { text: 'This is a title' },
              paragraph: { text: 'This is a description' },
              action: '/api/table/scores',
              inputs: [
                {
                  name: 'score',
                  label: 'Score',
                  type: 'number',
                },
              ],
              buttons: [
                {
                  type: 'submit',
                  label: 'Save',
                },
              ],
              successMessage: 'Your score has been saved',
            },
          ],
        },
      ],
      tables: [
        {
          name: 'scores',
          fields: [
            {
              name: 'score',
              field: 'Number',
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
    await page.fill('input[name="score"]', '3')
    await page.click('button')
    await page.getByText('Your score has been saved').waitFor({ state: 'visible' })

    // THEN
    const record = await database
      .table('scores')
      .read([{ field: 'score', operator: '=', value: '3' }])
    expect(record?.score).toBe(3)
  })
})
