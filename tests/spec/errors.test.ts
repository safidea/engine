import { test, expect } from '@playwright/test'
import Spec from '@solumy/engine/spec'

test.describe('Spec schema errors', () => {
  test('empty config should return 3 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Spec().getSchemaErrors(config)

    // THEN
    expect(errors).toHaveLength(3)
  })
})
