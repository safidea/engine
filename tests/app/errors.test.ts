import { test, expect } from '@playwright/test'
import App from '@solumy/engine'

test.describe('App schema errors', () => {
  test('empty config should return 2 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new App().validateSchema(config)

    // THEN
    expect(errors).toHaveLength(2)
  })
})
