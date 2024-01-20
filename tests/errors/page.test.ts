import { test, expect } from '@playwright/test'
import { Page, PageError } from '@solumy/engine/page'

test.describe('Page errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Page(config)

    // THEN
    expect(app.errors).toHaveLength(4)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Page(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'PAGE_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const app = new Page(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'PAGE_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const app = new Page(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'PAGE_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
    expect((error as PageError).data?.property).toBe('unknown')
  })
})
