import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

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
                  blockRef: 'BlockThatDoesNotExist',
                  component: 'Title',
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

  test('should not be able to load a block with the wrong component', async () => {
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
                  blockRef: 'Marketing',
                  component: 'Title',
                },
              ],
            },
          ],
        },
      ],
      blocks: [
        {
          ref: 'Marketing',
          component: 'Paragraph',
          text: 'This is a paragraph',
        },
      ],
    }

    // WHEN
    const errors = await new App().getConfigErrors(config)

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toContain('BlockRef Marketing is not a Paragraph component')
  })
})
