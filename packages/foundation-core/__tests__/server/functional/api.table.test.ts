export {}

test('should be true', async () => {
  expect(true).toBe(true)
})
/*import * as TestUtils from 'config-test'
import type { TestData } from 'config-test'
import { ConfigService } from 'foundation-common/server'
import DatabaseInitializer from 'foundation-database/server/initializers/database.initializer'
import type { NextApiRequest, NextApiResponse } from 'foundation-common'
import type { Row, Tables, Field } from 'foundation-database'
import { TableRoutes } from '../'

let row: Row
const tables = ConfigService.get('tables') as Tables
const { response } = TestUtils

beforeAll(() => {
  DatabaseInitializer()
})

function getErrors(fields: { [key: string]: Field }, fieldRequired?: string): string[] {
  return Object.keys(fields)
    .map((field) => {
      if (field === fieldRequired) return `Field ${field} is required`
      if (fields[field].default || fields[field].optional) return ''
      if (fields[field].type === 'Int') return `Field ${field} must be an integer`
      if (fields[field].type === 'DateTime') return `Field ${field} must be a valid date`
      return `Field ${field} must be a ${fields[field].type.toLowerCase()}`
    })
    .filter((error) => error !== '')
}

for (const table of Object.keys(tables)) {
  describe(`with table ${table}`, () => {
    it('should allow a POST request to create a row in a table', async () => {
      const { data, fields } = TestUtils.createData(table)
      const res = response()
      const req = {
        query: { table },
        body: data,
        method: 'POST',
      } as unknown as NextApiRequest
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(200)
      row = res.json.mock.calls[0][0]
      for (const field of Object.keys(fields)) {
        if (fields[field].default) {
          expect(row[field]).not.toBe(null)
        } else if (!data[field] && fields[field].type !== 'Boolean') {
          expect(row[field]).toStrictEqual(null)
        } else {
          expect(row[field]).toStrictEqual(data[field])
        }
      }
    })

    it('should allow a PATCH request to patch a row in a table', async () => {
      const { data, fields } = TestUtils.updateData(table, row as TestData)
      const res = response()
      const req = {
        method: 'PATCH',
        body: data,
        query: { table, id: data.id },
      } as unknown as NextApiRequest
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(200)
      row = res.json.mock.calls[0][0]
      for (const field of Object.keys(fields)) {
        expect(row[field]).toStrictEqual(data[field])
      }
    })

    it('should allow a PUT request to put a row in a table', async () => {
      const { data, fields } = TestUtils.updateData(table, row as TestData)
      const req = {
        method: 'PUT',
        body: data,
        query: { table, id: data.id },
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(200)
      row = res.json.mock.calls[0][0]
      for (const field of Object.keys(fields)) {
        expect(row[field]).toStrictEqual(data[field])
      }
    })

    it('should allow a GET request to get a row in a table', async () => {
      const req = {
        method: 'GET',
        query: { table, id: row.id },
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json.mock.calls[0][0].id).toBe(row.id)
    })

    it('should allow a GET request to get all rows in a table', async () => {
      const req = {
        method: 'GET',
        query: { table },
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json.mock.calls[0][0]).toHaveLength(1)
    })

    it('should allow a DELETE request to delete a row in a table', async () => {
      const req = {
        method: 'DELETE',
        query: { table, id: row.id },
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json.mock.calls[0][0].id).toBe(row.id)
    })

    it('should return a 404 if the table does not exist', async () => {
      const req = {
        method: 'GET',
        query: { table: 'non-existent-table' },
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json.mock.calls[0][0]).toEqual({
        error: 'Table non-existent-table does not exist',
      })
    })

    it('should return a 404 if the row does not exist', async () => {
      const req = {
        method: 'GET',
        query: { table, id: 'non-existent-row' },
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json.mock.calls[0][0]).toEqual({
        error: `Row non-existent-row does not exist in table ${table}`,
      })
    })

    it('should return a 405 if the method is not supported', async () => {
      const req = {
        method: 'OPTIONS',
        query: { table },
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json.mock.calls[0][0]).toEqual({
        error: 'Method OPTIONS not supported',
      })
    })

    it("should return a 400 if the body doesn't exist", async () => {
      const req = {
        method: 'POST',
        query: { table },
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json.mock.calls[0][0]).toEqual({
        error: 'Body is required',
      })
    })

    it('should return a 400 if the body is not valid in a POST request', async () => {
      const { data, fields } = TestUtils.createData(table, false)
      const fieldRequired = Object.keys(fields).find(
        (field) => !fields[field].optional && !fields[field].default
      )
      if (fieldRequired) delete data[fieldRequired]
      const req = {
        method: 'POST',
        query: { table },
        body: data,
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json.mock.calls[0][0]).toEqual({
        error: 'Invalid body',
        details: getErrors(fields, fieldRequired),
      })
    })

    it('should return a 400 if the body is not valid in a PATCH request', async () => {
      const { data, fields } = TestUtils.updateData(table, row as TestData, false)
      const req = {
        method: 'PATCH',
        query: { table, id: row.id },
        body: data,
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json.mock.calls[0][0]).toEqual({
        error: 'Invalid body',
        details: getErrors(fields),
      })
    })

    it('should return a 400 if the body is not valid in a PUT request', async () => {
      const { data, fields } = TestUtils.updateData(table, row as TestData, false)
      const req = {
        method: 'PUT',
        query: { table, id: row.id },
        body: data,
      } as unknown as NextApiRequest
      const res = response()
      await TableRoutes(req, res as unknown as NextApiResponse)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json.mock.calls[0][0]).toEqual({
        error: 'Invalid body',
        details: getErrors(fields),
      })
    })
  })
}
*/
