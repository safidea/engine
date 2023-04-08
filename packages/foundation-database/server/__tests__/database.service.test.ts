import * as TestUtils from 'config-test'
import type { TestData } from 'config-test'
import { ConfigService } from 'foundation-common/server'
import { DatabaseService } from '../'
import { DEFAULT_FIELDS } from '../settings/fields.settings'
import DatabaseInitializer from '../initializers/database.initializer'

import type { Data, Row, Tables } from '../../types'

let row: Row
const tables = ConfigService.get('tables') as Tables

beforeAll(() => {
  DatabaseInitializer()
})

for (const table of Object.keys(tables)) {
  describe(`with table ${table}`, () => {
    it('should create a row in a table', async () => {
      const { data, fields } = TestUtils.createData(table)
      row = await DatabaseService(table).create(data as Data)
      for (const field of Object.keys(DEFAULT_FIELDS)) {
        expect(row).toHaveProperty(field)
      }
      for (const field of Object.keys(fields)) {
        if (fields[field].default) {
          expect(row[field]).not.toBe(null)
        } else if (!data[field] && fields[field].type !== 'Boolean') {
          expect(row[field]).toStrictEqual(null)
        } else {
          expect(row[field]).toStrictEqual(data[field])
        }
      }
      expect(row.created_at).not.toBe(null)
    })

    it('should patch a row in a table', async () => {
      const { data, fields } = TestUtils.updateData(table, row as TestData)
      row = await DatabaseService(table).patchById(row.id, data as Data)
      for (const field of Object.keys(fields)) {
        expect(row[field]).toStrictEqual(data[field])
      }
      expect(row.updated_at).not.toBe(null)
    })

    it('should put a row in a table', async () => {
      const { data, fields } = TestUtils.updateData(table, row as TestData)
      row = await DatabaseService(table).putById(row.id, data as Data)
      for (const field of Object.keys(fields)) {
        expect(row[field]).toStrictEqual(data[field])
      }
      expect(row.updated_at).not.toBe(null)
    })

    it('should upsert a new row in a table', async () => {
      const { data, fields } = TestUtils.createData(table)
      row = await DatabaseService(table).upsertById('', data as Data)
      for (const field of Object.keys(DEFAULT_FIELDS)) {
        expect(row).toHaveProperty(field)
      }
      for (const field of Object.keys(fields)) {
        if (fields[field].default) {
          expect(row[field]).not.toBe(null)
        } else if (!data[field] && fields[field].type !== 'Boolean') {
          expect(row[field]).toStrictEqual(null)
        } else {
          expect(row[field]).toStrictEqual(data[field])
        }
      }
      expect(row.created_at).not.toBe(null)
    })

    it('should upsert an existing row in a table', async () => {
      const { data, fields } = TestUtils.updateData(table, row as TestData)
      row = await DatabaseService(table).upsertById(row.id, data as Data)
      for (const field of Object.keys(fields)) {
        expect(row[field]).toStrictEqual(data[field])
      }
      expect(row.updated_at).not.toBe(null)
    })

    it('should get a row in a table', async () => {
      const foundRow = await DatabaseService(table).readById(row.id)
      expect(foundRow.id).toBe(row.id)
    })

    it('should get all rows in a table', async () => {
      const rows = await DatabaseService(table).list()
      expect(rows).toHaveLength(2)
    })

    it('should delete a row in a table', async () => {
      const deletedRow = await DatabaseService(table).deleteById(row.id)
      expect(deletedRow).toHaveProperty('id')
      expect(deletedRow.deleted_at).not.toBe(null)
    })
  })
}
