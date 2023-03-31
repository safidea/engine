import { faker } from '@faker-js/faker'

import { ConfigService, TestUtils } from 'foundation-common'
import DatabaseSetup from 'foundation-database/scripts/database.setup'
import type { NextApiRequest, NextApiResponse } from 'foundation-common'
import type { Data, Row, Config } from 'foundation-database'
import { TableRoutes } from '../src'

let row: Row
let table: string
const { response } = TestUtils
const newData = (): Data => ({
  stringField: faker.helpers.unique(faker.name.firstName),
  integerField: faker.datatype.number(),
})

beforeAll(async () => {
  const { tables } = (await ConfigService.get()) as Config
  table = Object.keys(tables)[0]
  await DatabaseSetup()
})

test('should allow a POST request to create a row in a table', async () => {
  const res = response()
  const req = {
    query: { table },
    body: newData(),
    method: 'POST',
  } as unknown as NextApiRequest
  await TableRoutes(req, res as unknown as NextApiResponse)
  expect(res.status).toHaveBeenCalledWith(200)
  row = res.json.mock.calls[0][0]
  expect(row).toHaveProperty('id')
})

test('should allow a PATCH request to patch a row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  const res = response()
  const req = {
    method: 'PATCH',
    body: { ...row, stringField: newString },
    query: { table, id: row.id },
  } as unknown as NextApiRequest
  await TableRoutes(req, res as unknown as NextApiResponse)
  expect(res.status).toHaveBeenCalledWith(200)
  row = res.json.mock.calls[0][0]
  expect(row.stringField).toBe(newString)
})

test('should allow a PUT request to put a row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  const req = {
    method: 'PUT',
    body: { ...row, stringField: newString },
    query: { table, id: row.id },
  } as unknown as NextApiRequest
  const res = response()
  await TableRoutes(req, res as unknown as NextApiResponse)
  expect(res.status).toHaveBeenCalledWith(200)
  row = res.json.mock.calls[0][0]
  expect(row.stringField).toBe(newString)
})

test('should allow a GET request to get a row in a table', async () => {
  const req = {
    method: 'GET',
    query: { table, id: row.id },
  } as unknown as NextApiRequest
  const res = response()
  await TableRoutes(req, res as unknown as NextApiResponse)
  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.json.mock.calls[0][0].id).toBe(row.id)
})

test('should allow a GET request to get all rows in a table', async () => {
  const req = {
    method: 'GET',
    query: { table },
  } as unknown as NextApiRequest
  const res = response()
  await TableRoutes(req, res as unknown as NextApiResponse)
  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.json.mock.calls[0][0]).toHaveLength(1)
})

test('should allow a DELETE request to delete a row in a table', async () => {
  const req = {
    method: 'DELETE',
    query: { table, id: row.id },
  } as unknown as NextApiRequest
  const res = response()
  await TableRoutes(req, res as unknown as NextApiResponse)
  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.json.mock.calls[0][0].id).toBe(row.id)
})

test('should return a 404 if the table does not exist', async () => {
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

test('should return a 404 if the row does not exist', async () => {
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

test('should return a 405 if the method is not supported', async () => {
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

test("should return a 400 if the body doesn't exist", async () => {
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

test('should return a 400 if the body is not valid in a POST request', async () => {
  const req = {
    method: 'POST',
    query: { table },
    body: { ...newData(), stringField: 123 },
  } as unknown as NextApiRequest
  const res = response()
  await TableRoutes(req, res as unknown as NextApiResponse)
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.json.mock.calls[0][0]).toEqual({
    error: 'Invalid body',
    details: ['Field stringField must be a string'],
  })
})

test('should return a 400 if the body is not valid in a PATCH request', async () => {
  const req = {
    method: 'PATCH',
    query: { table, id: row.id },
    body: { ...row, integerField: 'hello' },
  } as unknown as NextApiRequest
  const res = response()
  await TableRoutes(req, res as unknown as NextApiResponse)
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.json.mock.calls[0][0]).toEqual({
    error: 'Invalid body',
    details: ['Field integerField must be an integer'],
  })
})

test('should return a 400 if the body is not valid in a PUT request', async () => {
  const req = {
    method: 'PUT',
    query: { table, id: row.id },
    body: { ...row, integerField: null, datetimeField: 'hello', booleanField: 'hello' },
  } as unknown as NextApiRequest
  const res = response()
  await TableRoutes(req, res as unknown as NextApiResponse)
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.json.mock.calls[0][0]).toEqual({
    error: 'Invalid body',
    details: [
      'Field integerField is required',
      'Field datetimeField must be a valid date',
      'Field booleanField must be a boolean',
    ],
  })
})
