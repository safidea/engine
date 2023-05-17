import './setup'
import { DatabaseConfig, DatabaseService } from 'server-database'
import { TableService, TableConfig } from '../../../src'
import { ConfigUtils, TestUtils } from 'server-common'

import type { DatabaseRowType } from 'shared-database'

let row: DatabaseRowType
const table = 'tasks'
const base = 'main'

beforeAll(async () => {
  ConfigUtils.exec([DatabaseConfig, TableConfig])
  await TestUtils.updateLibraries(['server-database'])
  DatabaseService.initLibraries()
})

describe('create', () => {
  it('should return a row', async () => {
    const { data } = TestUtils.createValidData(table)
    row = await TableService.create(base, table, { data })
    expect(row.id).toBeDefined()
  })
})

describe('read', () => {
  it('should return a row', async () => {
    const result = await TableService.read(base, table, {
      id: row.id,
    })
    expect(result).toBeDefined()
  })
})

describe('update', () => {
  it('should return a row with updated_at property', async () => {
    const { data } = TestUtils.updateValidData(table, row as DatabaseRowType)
    row = await TableService.update(base, table, {
      id: row.id,
      data,
    })
    expect(row.id).toBeDefined()
    expect(row.updated_at).toBeDefined()
  })
})

describe('delete', () => {
  it('should return a row with deleted_at property', async () => {
    const result = await TableService.delete(base, table, {
      id: row.id,
    })
    expect(row.id).toBeDefined()
    expect(result.deleted_at).toBeDefined()
  })
})

describe('list', () => {
  it('should return a row', async () => {
    const result = await TableService.list(base, table)
    expect(result).toHaveLength(1)
  })
})
