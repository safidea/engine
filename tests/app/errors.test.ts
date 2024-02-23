import { test, expect } from '@playwright/test'
import App from '@solumy/engine'

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
