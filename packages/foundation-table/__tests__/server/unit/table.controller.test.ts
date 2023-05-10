import TableController from '@table/server/controllers/table.controller'

import type { RequestType } from '@common/server'

jest.mock('@database/server/lib/prisma.lib')

const request: RequestType = {
  locals: {},
  query: {
    base: 'master',
    table: 'User',
  },
  body: {
    name: 'test',
  },
}

describe('create', () => {
  it('should return a row', async () => {
    const response = await TableController.create(request)
    expect(response.json).toEqual({ id: '1', name: 'test' })
  })
})

describe('update', () => {
  it('should return a row', async () => {
    request.query.id = '1'
    const response = await TableController.update(request)
    expect(response.json).toEqual({ id: '1', name: 'test' })
  })
})

describe('read', () => {
  it('should return a row', async () => {
    const response = await TableController.read(request)
    expect(response.json).toEqual({ id: '1', name: 'test' })
  })
})

describe('list', () => {
  it('should return rows', async () => {
    const response = await TableController.list(request)
    expect(response.json).toEqual([
      { id: '1', name: 'test' },
      { id: '2', name: 'test' },
    ])
  })
})

describe('delete', () => {
  it('should return a row', async () => {
    const response = await TableController.delete(request)
    expect(response.json).toEqual({ id: '1', name: 'test' })
  })
})
