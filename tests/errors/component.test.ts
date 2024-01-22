import { test, expect } from '@playwright/test'
import { Component, ComponentError } from '@solumy/engine/component'

test.describe('Component schema errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Component(config)

    // THEN
    expect(app.errors).toHaveLength(2)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Component(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'COMPONENT_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(ComponentError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const app = new Component(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'COMPONENT_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(ComponentError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const app = new Component(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'COMPONENT_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(ComponentError)
    expect((error as ComponentError).data?.property).toBe('unknown')
  })
})
