import TableController from '@table/server/controllers/table.controller'

import type { ApiRequestInterface, ApiResponseInterface } from '@common'

jest.mock('@database/server/lib/prisma.lib')

const res = {
  status: jest.fn(() => res),
  json: jest.fn(() => res),
} as unknown as ApiResponseInterface

beforeEach(() => {
  jest.clearAllMocks()
})

describe('create', () => {
  it('should return a row', async () => {
    const req = {
      query: {
        base: 'master',
        table: 'User',
      },
      body: {
        name: 'test',
      },
    } as unknown as ApiRequestInterface
    await TableController.create(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({ id: '1', name: 'test' })
  })
})

describe('update', () => {
  it('should return a row', async () => {
    const req = {
      query: {
        base: 'master',
        table: 'User',
        id: '1',
      },
      body: {
        name: 'test',
      },
    } as unknown as ApiRequestInterface
    await TableController.update(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({ id: '1', name: 'test' })
  })
})

describe('read', () => {
  it('should return a row', async () => {
    const req = {
      query: {
        base: 'master',
        table: 'User',
        id: '1',
      },
    } as unknown as ApiRequestInterface
    await TableController.read(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({ id: '1', name: 'test' })
  })
})

describe('list', () => {
  it('should return rows', async () => {
    const req = {
      query: {
        base: 'master',
        table: 'User',
      },
    } as unknown as ApiRequestInterface
    await TableController.list(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith([
      { id: '1', name: 'test' },
      { id: '2', name: 'test' },
    ])
  })
})

describe('delete', () => {
  it('should return a row', async () => {
    const req = {
      query: {
        base: 'master',
        table: 'User',
        id: '1',
      },
    } as unknown as ApiRequestInterface
    await TableController.delete(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({ id: '1', name: 'test' })
  })
})
