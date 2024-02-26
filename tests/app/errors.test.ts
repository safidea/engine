import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'

test.describe('App schema errors', () => {
  test('should return 2 errors if config is empty', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new App().getSchemaErrors(config)

    // THEN
    expect(errors).toHaveLength(2)
  })
})

test.describe('App config errors', () => {
  test('should not be able to load a block that does not exist', async () => {
    // GIVEN
    const config: Config = {
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
                  block: 'BlockThatDoesNotExist',
                },
              ],
            },
          ],
        },
      ],
    }

    // WHEN
    const errors = await new App().getConfigErrors(config)

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toContain('Block BlockThatDoesNotExist does not exist')
  })
})
