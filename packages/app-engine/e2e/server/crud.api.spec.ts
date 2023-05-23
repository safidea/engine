import { test, expect } from '@playwright/test'
import config from '../app/config.json'
import TestUtils from 'server-common/src/utils/test.utils'

import type { TestDataType } from 'server-common'

for (const table in config.tables) {
  const database = config.tables[table].database
  let row: TestDataType

  test.describe(`CRUD API for table ${table}`, () => {
    test(`should create a row in table ${table}`, async ({ request }) => {
      const { data } = TestUtils.createValidData(table)
      const response = await request.post(`api/table/${database}/${table}`, { data })
      expect(response.ok()).toBeTruthy()
      row = await response.json()
      expect(row).toHaveProperty('id')
      for (const field of Object.keys(data)) {
        expect(row).toHaveProperty(field, data[field])
      }
    })

    test(`should read a row in table ${table}`, async ({ request }) => {
      const response = await request.get(`api/table/${database}/${table}/${row.id}`)
      expect(response.ok()).toBeTruthy()
      const newRow = await response.json()
      for (const field of Object.keys(row)) {
        expect(newRow).toHaveProperty(field, row[field])
      }
    })

    test(`should update a row in table ${table}`, async ({ request }) => {
      const { data } = TestUtils.updateValidData(table, row)
      const response = await request.patch(`api/table/${database}/${table}/${row.id}`, { data })
      expect(response.ok()).toBeTruthy()
      row = await response.json()
      for (const field of Object.keys(data)) {
        if (field === 'updated_at') expect(row).toHaveProperty('updated_at', expect.any(String))
        else expect(row).toHaveProperty(field, data[field])
      }
    })

    test(`should delete a row in table ${table}`, async ({ request }) => {
      const response = await request.delete(`api/table/${database}/${table}/${row.id}`)
      expect(response.ok()).toBeTruthy()
      const deletedRow = await response.json()
      for (const field of Object.keys(row)) {
        if (field === 'deleted_at')
          expect(deletedRow).toHaveProperty('deleted_at', expect.any(String))
        else expect(deletedRow).toHaveProperty(field, row[field])
      }
    })
  })
}
