import { test, expect } from '@playwright/test'
import { createTable, TableError } from '@solumy/engine/table'

test.describe('Table schema errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = await createTable(config)

    // THEN
    expect(errors).toHaveLength(2)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = await createTable(config)

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
    const { errors } = await createTable(config)

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
    const { errors } = await createTable(config)

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
