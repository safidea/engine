import { test, expect } from '@tests/fixtures'
import Table from '@solumy/engine/table'

test.describe('Table schema errors', () => {
  test('empty config should return 2 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Table().getSchemaErrors(config)

    // THEN
    expect(errors).toHaveLength(2)
  })
})
