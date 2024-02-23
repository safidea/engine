import { test, expect, helpers } from '@test/e2e/fixtures'

test.describe('Config Errors', () => {
  test('should return an error when a required field is missing', async () => {
    // GIVEN
    const config: any = {
      pages: [
        {
          path: '/',
          title: undefined,
          components: [
            {
              type: 'paragraph',
              text: 'Hello World!',
            },
          ],
        },
      ],
    }

    // WHEN
    const call = async () => helpers.startApp(config)

    // THEN
    await expect(call).rejects.toThrow(
      'Expecting string at pages.0.title but instead got: undefined'
    )
  })
})
