import TableMiddleware from '@table/server/middlewares/table.middleware'
import DatabaseService from '@database/server/services/database.service'
import { ConfigUtils } from '@common/server'

import type { ApiRequestInterface, ApiResponseInterface } from '@common'

jest.mock('@database/server/services/database.service')

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as ApiResponseInterface

beforeEach(() => {
  jest.clearAllMocks()
})

describe('validateBaseExist', () => {
  it('should return 404 if base does not exist', async () => {
    const req = {
      query: {
        base: 'base',
      },
    } as unknown as ApiRequestInterface
    const baseExist = DatabaseService.baseExist as jest.MockedFunction<
      typeof DatabaseService.baseExist
    >
    baseExist.mockReturnValueOnce(false)
    await TableMiddleware.validateBaseExist(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Base base does not exist',
    })
  })

  it('should call next if base exist', async () => {
    const req = {
      query: {
        base: 'master',
      },
    } as unknown as ApiRequestInterface
    const next = jest.fn()
    await TableMiddleware.validateBaseExist(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})

describe('validateTableExist', () => {
  it('should return 404 if table does not exist', async () => {
    const req = {
      query: {
        base: 'master',
        table: 'table',
      },
    } as unknown as ApiRequestInterface
    const tableExist = DatabaseService.tableExist as jest.MockedFunction<
      typeof DatabaseService.tableExist
    >
    tableExist.mockReturnValueOnce(false)
    await TableMiddleware.validateTableExist(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Table table does not exist',
    })
  })

  it('should call next if table exist', async () => {
    const req = {
      query: {
        base: 'master',
        table: 'User',
      },
    } as unknown as ApiRequestInterface
    const next = jest.fn()
    await TableMiddleware.validateTableExist(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})

describe('validateRowExist', () => {
  it('should return 404 if row does not exist', async () => {
    const req = {
      query: {
        base: 'master',
        table: 'users',
        id: '1',
      },
    } as unknown as ApiRequestInterface
    const readById = DatabaseService.readById as jest.MockedFunction<
      typeof DatabaseService.readById
    >
    readById.mockReturnValueOnce(Promise.resolve(null))
    await TableMiddleware.validateRowExist(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Row 1 does not exist in table users',
    })
  })

  it('should call next if row exist', async () => {
    const req = {
      query: {
        base: 'master',
        table: 'users',
        id: '1',
      },
    } as unknown as ApiRequestInterface
    const next = jest.fn()
    await TableMiddleware.validateRowExist(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})

describe('validateBody', () => {
  it('should return 400 if body is not present', async () => {
    const req = {} as unknown as ApiRequestInterface
    await TableMiddleware.validateBody(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Body is required',
    })
  })

  it('should call next if body is present', async () => {
    const req = {
      body: {},
    } as unknown as ApiRequestInterface
    const next = jest.fn()
    await TableMiddleware.validateBody(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})

describe('validateBodyFields', () => {
  beforeAll(() => {
    ConfigUtils.set('tables', {
      users: {
        fields: {
          name: {
            type: 'String',
            optional: true,
          },
          email: {
            type: 'String',
          },
          password: {
            type: 'String',
            optional: true,
          },
        },
      },
    })
  })

  it('should return 400 if body is missing fields', async () => {
    const req = {
      query: {
        table: 'users',
      },
      body: {
        name: 'name',
      },
    } as unknown as ApiRequestInterface
    await TableMiddleware.validateBodyFields(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid body',
      details: ['Field email is required'],
    })
  })

  it('should call next if body has all fields', async () => {
    const req = {
      query: {
        table: 'users',
      },
      body: {
        name: 'name',
        email: 'email',
      },
    } as unknown as ApiRequestInterface
    const next = jest.fn()
    await TableMiddleware.validateBodyFields(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})

describe('validateBodyAllFields', () => {
  beforeAll(() => {
    ConfigUtils.set('tables', {
      users: {
        fields: {
          name: {
            type: 'String',
            optional: true,
          },
          email: {
            type: 'String',
          },
          password: {
            type: 'String',
            optional: true,
          },
        },
      },
    })
  })

  it('should return 400 if body is missing required fields', async () => {
    const req = {
      query: {
        table: 'users',
      },
      body: {
        name: 'name',
        password: 1,
      },
    } as unknown as ApiRequestInterface
    await TableMiddleware.validateBodyAllFields(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid body',
      details: ['Field email is required', 'Field password must be a string'],
    })
  })

  it('should call next if body has all required fields', async () => {
    const req = {
      query: {
        table: 'users',
      },
      body: {
        name: 'name',
        email: 'email',
        password: 'password',
      },
    } as unknown as ApiRequestInterface
    const next = jest.fn()
    await TableMiddleware.validateBodyAllFields(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
