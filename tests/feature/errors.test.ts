import { test, expect } from '@playwright/test'
import Feature, { FeatureError } from '@solumy/engine/feature'

test.describe('Feature schema errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Feature(config).getErrors()

    // THEN
    expect(errors).toHaveLength(1)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Feature(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'FEATURE_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const errors = new Feature(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'FEATURE_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const errors = new Feature(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'FEATURE_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
    if (!error) return
    const data = error.data
    expect(data).toBeDefined()
    expect(data).toHaveProperty('property')
    if (data && 'property' in data) expect(data.property).toBe('unknown')
  })
})
