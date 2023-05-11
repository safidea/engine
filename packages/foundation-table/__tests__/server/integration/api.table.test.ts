import DatabaseConfig from '@database/server/configs/database.config'
import TableConfig from '@table/server/configs/table.config'
import { DatabaseUtils, PrismaLib, PrismaUtils } from '@database/server'
import { TableRoute } from '@table/server'
import { ConfigUtils } from '@common/server'
import { TestUtils, TestData } from '@test/server'

import type { RouteHandlerContextType } from '@common/server'
import type { DatabaseRowType } from '@database'
import type { TestDataInterface } from '@test'
import type { TableFieldInterface } from '@table'

let baseId = ''
let row: DatabaseRowType
let request: Request
let testData: any
const table = 'tasks'
const base = 'main'
const context: RouteHandlerContextType = { params: { table, base } }
const url = `http://localhost:3000/api/table/${base}/${table}`

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

  it('should allow a POST request to create a row in a table', async () => {
    const { data, fields } = testData.createValid()
    request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const response = await TableRoute.POST(request, context)
    row = (await response.json()) as DatabaseRowType
    expect(response.status).toEqual(200)
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
    request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    context.params = { ...context.params, id: String(data.id) }
    const response = await TableRoute.PATCH(request, context)
    expect(response.status).toEqual(200)
    row = (await response.json()) as DatabaseRowType
    for (const field of Object.keys(fields)) {
      expect(row[field]).toStrictEqual(data[field])
    }
  })

  it('should allow a PUT request to put a row in a table', async () => {
    const { data, fields } = testData.updateValid(row as TestDataInterface)
    request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    context.params = { ...context.params, id: String(data.id) }
    const response = await TableRoute.PUT(request, context)
    expect(response.status).toEqual(200)
    row = (await response.json()) as DatabaseRowType
    for (const field of Object.keys(fields)) {
      expect(row[field]).toStrictEqual(data[field])
    }
  })

  it('should allow a GET request to get a row in a table', async () => {
    request = new Request(url)
    context.params = { ...context.params, id: String(row.id) }
    const response = await TableRoute.GET(request, context)
    expect(response.status).toEqual(200)
    const newRow = (await response.json()) as DatabaseRowType
    expect(newRow.id).toBe(row.id)
  })

  it('should allow a GET request to get all rows in a table', async () => {
    delete context.params.id
    const response = await TableRoute.GET(request, context)
    expect(response.status).toEqual(200)
    const rows = (await response.json()) as DatabaseRowType
    expect(rows).toHaveLength(1)
  })

  it('should allow a DELETE request to delete a row in a table', async () => {
    context.params = { ...context.params, id: String(row.id) }
    const response = await TableRoute.DELETE(request, context)
    expect(response.status).toEqual(200)
    const newRow = (await response.json()) as DatabaseRowType
    expect(newRow.id).toBe(row.id)
  })

  it('should return a 404 if the table does not exist in a GET request', async () => {
    context.params = { table: 'non-existent-table', base }
    const response = await TableRoute.GET(request, context)
    expect(response.status).toEqual(404)
    expect(await response.json()).toEqual({
      error: 'Table non-existent-table does not exist',
    })
  })

  it('should return a 404 if the row does not exist in a GET request', async () => {
    context.params = { table, base, id: 'non-existent-row' }
    const response = await TableRoute.GET(request, context)
    expect(response.status).toEqual(404)
    expect(await response.json()).toEqual({
      error: `Row non-existent-row does not exist in table ${table}`,
    })
  })

  it("should return a 400 if the body doesn't exist in a POST request", async () => {
    delete context.params.id
    const response = await TableRoute.POST(request, context)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
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
    request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const response = await TableRoute.POST(request, context)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      error: 'Invalid body',
      details: getErrors(fields, fieldRequired),
    })
  })

  it('should return a 400 if the body is not valid in a PATCH request', async () => {
    const { data, fields } = testData.updateInvalid(row as TestDataInterface)
    context.params = { ...context.params, id: String(row.id) }
    request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    const response = await TableRoute.PATCH(request, context)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      error: 'Invalid body',
      details: getErrors(fields),
    })
  })

  it('should return a 400 if the body is not valid in a PUT request', async () => {
    const { data, fields } = testData.updateInvalid(row as TestDataInterface)
    request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    const response = await TableRoute.PUT(request, context)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      error: 'Invalid body',
      details: getErrors(fields),
    })
  })

  it('should return a 400 if fields are invalids', async () => {
    const { data } = testData.createValid()
    data.token = 'invalid token'
    request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    context.params = { ...context.params, id: String(row.id) }
    const response = await TableRoute.POST(request, context)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      error: 'Invalid body',
      details: ['Invalid fields: token'],
    })
  })
})