import { test, expect, Engine } from '@test/e2e/fixtures'

test.describe('Config Errors', () => {
  test('should return an error when a required field is missing', async ({ folder }) => {
    // GIVEN
    const port = 50801
    const app = new Engine({ port, folder })

    // WHEN
    const call = async () =>
      app.start({
        pages: [
          {
            path: '/',

            components: [
              {
                type: 'paragraph',
                text: 'Hello World!',
              },
            ],
          },
        ],
      })

    // THEN
    await expect(call).rejects.toThrow(
      'Expecting string at pages.0.title but instead got: undefined'
    )
  })
})
