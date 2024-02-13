import { test, expect } from '@playwright/test'
import Table from '@solumy/engine/table'

test.describe('Table schema errors', () => {
  test('empty config should return 2 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Table().validateSchema(config)

    // THEN
    expect(errors).toHaveLength(2)
  })
})
