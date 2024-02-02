import { test, expect } from '@playwright/test'
import Table, { TableError } from '@solumy/engine/table'

test.describe.only('Table schema errors', () => {
  test('empty config should return 2 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Table().getConfigErrors(config)

    // THEN
    expect(errors).toHaveLength(2)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Table().getConfigErrors(config)

    // THEN
    const error = errors?.find((e) => e.code === 'TABLE_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(TableError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const errors = new Table().getConfigErrors(config)

    // THEN
    const error = errors?.find((e) => e.code === 'TABLE_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(TableError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const errors = new Table().getConfigErrors(config)

    // THEN
    const error = errors?.find((e) => e.code === 'TABLE_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(TableError)
    if (!error) return
    const data = error.data
    expect(data).toBeDefined()
    expect(data).toHaveProperty('property')
    if (data && 'property' in data) expect(data.property).toBe('unknown')
  })
})
