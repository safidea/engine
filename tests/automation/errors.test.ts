import { test, expect } from '@playwright/test'
import Automation, { AutomationError } from '@solumy/engine/automation'

test.describe('Automations schema errors', () => {
  test('empty config should return 3 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Automation(config).getErrors()

    // THEN
    expect(errors).toHaveLength(3)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Automation(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'AUTOMATION_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AutomationError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const errors = new Automation(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'AUTOMATION_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AutomationError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const errors = new Automation(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'AUTOMATION_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AutomationError)
    if (!error) return
    const data = error.data
    expect(data).toBeDefined()
    expect(data).toHaveProperty('property')
    if (data && 'property' in data) expect(data.property).toBe('unknown')
  })
})
