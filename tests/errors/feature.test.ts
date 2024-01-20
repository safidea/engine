import { test, expect } from '@playwright/test'
import { Feature, FeatureError } from '@solumy/engine/feature'

test.describe('Feature errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Feature(config)

    // THEN
    expect(app.errors).toHaveLength(4)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Feature(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'FEATURE_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const app = new Feature(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'FEATURE_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const app = new Feature(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'FEATURE_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
    expect((error as FeatureError).data?.property).toBe('unknown')
  })
})
