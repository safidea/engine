import DatabaseConfig from '@database/server/configs/database.config'
import TableConfig from '@table/server/configs/table.config'
import { DatabaseUtils, PrismaLib, PrismaUtils } from '@database/server'
import { TableRoute } from '@table/server'
import { RouterUtils, ConfigUtils } from '@common/server'
import { TestUtils, TestData } from '@test/server'

import type { DatabaseRowType } from '@database'
import type { ApiRequestInterface, ApiResponseInterface } from '@common'
import type { TestDataInterface } from '@test'
import type { TableFieldInterface } from '@table'

let baseId = ''
let row: DatabaseRowType
const table = 'tasks'
const base = 'main'
const TableRouteApi = RouterUtils.handler(TableRoute)
let testData: any

beforeAll(async () => {
  baseId = await TestUtils.createTestApp('base')
  TestUtils.loadEnvFile(baseId)
  ConfigUtils.init()
  TestUtils.configTestApp([DatabaseConfig, TableConfig])
  await PrismaLib.updateClients(PrismaUtils.getClientFolder())
})

afterAll(async () => {
  DatabaseUtils.cleanImport()
  await TestUtils.destroyTestApp(baseId)
})

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as jest.Mocked<ApiResponseInterface>

function getErrors(
  fields: { [key: string]: TableFieldInterface },
  fieldRequired?: string
): string[] {
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

describe(`with table ${table}`, () => {
  beforeAll(async () => {
    testData = new TestData({ appIdName: baseId, tableName: table })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should allow a POST request to create a row in a table', async () => {
    const { data, fields } = testData.createValid()
    const req = {
      query: { table, base },
      body: data,
      method: 'POST',
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    row = res.json.mock.calls[0][0] as DatabaseRowType
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
    const { data, fields } = testData.updateValid(row as TestDataInterface)
    const req = {
      method: 'PATCH',
      body: data,
      query: { table, base, id: data.id },
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    row = res.json.mock.calls[0][0] as DatabaseRowType
    for (const field of Object.keys(fields)) {
      expect(row[field]).toStrictEqual(data[field])
    }
  })

  it('should allow a PUT request to put a row in a table', async () => {
    const { data, fields } = testData.updateValid(row as TestDataInterface)
    const req = {
      method: 'PUT',
      body: data,
      query: { table, base, id: data.id },
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    row = res.json.mock.calls[0][0] as DatabaseRowType
    for (const field of Object.keys(fields)) {
      expect(row[field]).toStrictEqual(data[field])
    }
  })

  it('should allow a GET request to get a row in a table', async () => {
    const req = {
      method: 'GET',
      query: { table, base, id: row.id },
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    const newRow = res.json.mock.calls[0][0] as DatabaseRowType
    expect(newRow.id).toBe(row.id)
  })

  it('should allow a GET request to get all rows in a table', async () => {
    const req = {
      method: 'GET',
      query: { table, base },
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json.mock.calls[0][0]).toHaveLength(1)
  })

  it('should allow a DELETE request to delete a row in a table', async () => {
    const req = {
      method: 'DELETE',
      query: { table, base, id: row.id },
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    const newRow = res.json.mock.calls[0][0] as DatabaseRowType
    expect(newRow.id).toBe(row.id)
  })

  it('should return a 404 if the table does not exist', async () => {
    const req = {
      method: 'GET',
      query: { table: 'non-existent-table', base },
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json.mock.calls[0][0]).toEqual({
      error: 'Table non-existent-table does not exist',
    })
  })

  it('should return a 404 if the row does not exist', async () => {
    const req = {
      method: 'GET',
      query: { table, base, id: 'non-existent-row' },
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json.mock.calls[0][0]).toEqual({
      error: `Row non-existent-row does not exist in table ${table}`,
    })
  })

  it('should return a 405 if the method is not supported', async () => {
    const req = {
      method: 'OPTIONS',
      query: { table, base },
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json.mock.calls[0][0]).toEqual({
      error: 'Method OPTIONS not supported',
    })
  })

  it("should return a 400 if the body doesn't exist", async () => {
    const req = {
      method: 'POST',
      query: { table, base },
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json.mock.calls[0][0]).toEqual({
      error: 'Invalid body',
      details: [
        'Field name is required',
        'Field number is required',
        'Field started_at is required',
      ],
    })
  })

  it('should return a 400 if the body is not valid in a POST request', async () => {
    const { data, fields } = testData.createInvalid()
    const fieldRequired = Object.keys(fields).find(
      (field) => !fields[field].optional && !fields[field].default
    )
    if (fieldRequired) delete data[fieldRequired]
    const req = {
      method: 'POST',
      query: { table, base },
      body: data,
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json.mock.calls[0][0]).toEqual({
      error: 'Invalid body',
      details: getErrors(fields, fieldRequired),
    })
  })

  it('should return a 400 if the body is not valid in a PATCH request', async () => {
    const { data, fields } = testData.updateInvalid(row as TestDataInterface)
    const req = {
      method: 'PATCH',
      query: { table, base, id: row.id },
      body: data,
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json.mock.calls[0][0]).toEqual({
      error: 'Invalid body',
      details: getErrors(fields),
    })
  })

  it('should return a 400 if the body is not valid in a PUT request', async () => {
    const { data, fields } = testData.updateInvalid(row as TestDataInterface)
    const req = {
      method: 'PUT',
      query: { table, base, id: row.id },
      body: data,
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json.mock.calls[0][0]).toEqual({
      error: 'Invalid body',
      details: getErrors(fields),
    })
  })

  it('should return a 400 if fields are invalids', async () => {
    const { data } = testData.createValid()
    data.token = 'invalid token'
    const req = {
      method: 'POST',
      query: { table, base, id: row.id },
      body: data,
    } as unknown as ApiRequestInterface
    await TableRouteApi(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json.mock.calls[0][0]).toEqual({
      error: 'Invalid body',
      details: ['Invalid fields: token'],
    })
  })
})
