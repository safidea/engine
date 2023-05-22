import { TestUtils } from './setup'
import { DatabaseConfig, DatabaseService } from 'server-database'
import { TableRoute, TableConfig } from '../../../src'
import { ConfigUtils } from 'server-common'

import type { RouteHandlerContextType, TestDataType } from 'server-common'
import type { DatabaseRowType } from 'shared-database'

let row: DatabaseRowType
let request: Request
const table = 'tasks'
const base = 'main'
const context: RouteHandlerContextType = { params: { table, base } }
const url = `http://localhost:3000/api/table/${base}/${table}`

beforeAll(async () => {
  ConfigUtils.exec([DatabaseConfig, TableConfig])
  await TestUtils.updateLibraries(['server-database'])
  DatabaseService.initLibraries()
})

describe(`with table ${table}`, () => {
  it('should allow a POST request to create a row in a table', async () => {
    const { data, fields } = TestUtils.createValidData(table)
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
    const { data, fields } = TestUtils.updateValidData(table, row as TestDataType)
    request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    context.params = { ...context.params, id: String(data.id) }
    const response = await TableRoute.PATCH(request, context)
    expect(response.status).toEqual(200)
    row = (await response.json()) as DatabaseRowType
    for (const field of Object.keys(fields)) {
      if (field === 'updated_at') {
        expect(row[field]).not.toBe(null)
      } else {
        expect(row[field]).toStrictEqual(data[field])
      }
    }
  })

  it('should allow a PUT request to put a row in a table', async () => {
    const { data, fields } = TestUtils.updateValidData(table, row as TestDataType)
    request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    context.params = { ...context.params, id: String(data.id) }
    const response = await TableRoute.PUT(request, context)
    expect(response.status).toEqual(200)
    row = (await response.json()) as DatabaseRowType
    for (const field of Object.keys(fields)) {
      if (field === 'updated_at') {
        expect(row[field]).not.toStrictEqual(data[field])
      } else {
        expect(row[field]).toStrictEqual(data[field])
      }
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
    const { data, fields } = TestUtils.createInvalidData(table)
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
      details: TestUtils.getTableErrors(fields, fieldRequired),
    })
  })

  it('should return a 400 if the body is not valid in a PATCH request', async () => {
    const { data, fields } = TestUtils.updateInvalidData(table, row as TestDataType)
    context.params = { ...context.params, id: String(row.id) }
    request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    const response = await TableRoute.PATCH(request, context)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      error: 'Invalid body',
      details: TestUtils.getTableErrors(fields),
    })
  })

  it('should return a 400 if the body is not valid in a PUT request', async () => {
    const { data, fields } = TestUtils.updateInvalidData(table, row as TestDataType)
    request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    const response = await TableRoute.PUT(request, context)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      error: 'Invalid body',
      details: TestUtils.getTableErrors(fields),
    })
  })

  it('should return a 400 if fields are invalids', async () => {
    const { data } = TestUtils.createValidData(table)
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
