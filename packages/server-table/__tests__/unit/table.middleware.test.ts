import './setup'
import TableMiddleware from '../../src/middlewares/table.middleware'
import { ConfigUtils } from 'server-common'

import type { RequestInterface } from 'server-common'

const request: RequestInterface = {
  locals: {},
  query: {
    base: 'base',
  },
  body: {},
}

describe('validateBaseExist', () => {
  it('should return 404 if base does not exist', async () => {
    const response = await TableMiddleware.validateBaseExist(request)
    expect(response).toBeDefined()
    expect(response?.status).toEqual(404)
    expect(response?.json).toEqual({
      error: 'Base base does not exist',
    })
  })

  it('should call next if base exist', async () => {
    request.query.base = 'master'
    const response = await TableMiddleware.validateBaseExist(request)
    expect(response).toBeUndefined()
  })
})

describe('validateTableExist', () => {
  it('should return 404 if table does not exist', async () => {
    request.query.table = 'table'
    const response = await TableMiddleware.validateTableExist(request)
    expect(response).toBeDefined()
    expect(response?.status).toEqual(404)
    expect(response?.json).toEqual({
      error: 'Table table does not exist',
    })
  })

  it('should call next if table exist', async () => {
    request.query.table = 'users'
    const response = await TableMiddleware.validateTableExist(request)
    expect(response).toBeUndefined()
  })
})

describe('validateRowExist', () => {
  it('should return 404 if row does not exist', async () => {
    request.query.table = 'users'
    request.query.id = '2'
    const response = await TableMiddleware.validateRowExist(request)
    expect(response).toBeDefined()
    expect(response?.status).toEqual(404)
    expect(response?.json).toEqual({
      error: 'Row 2 does not exist in table users',
    })
  })

  it('should call next if row exist', async () => {
    request.query.id = '1'
    const response = await TableMiddleware.validateRowExist(request)
    expect(response).toBeUndefined()
  })
})

describe('validatePostBody', () => {
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
    request.body = {
      name: 'name',
      password: 1,
    }
    const response = await TableMiddleware.validatePostBody(request)
    expect(response).toBeDefined()
    expect(response?.status).toEqual(400)
    expect(response?.json).toEqual({
      error: 'Invalid body',
      details: ['Field email is required', 'Field password must be a string'],
    })
  })

  it('should call next if body has all required fields', async () => {
    request.body = {
      name: 'name',
      email: 'email',
      password: 'password',
    }
    const response = await TableMiddleware.validatePostBody(request)
    expect(response).toBeUndefined()
  })
})

describe('validatePatchBody', () => {
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

  it('should return 400 if body has unknown fields', async () => {
    request.body = {
      name: 'name',
      role: 'admin',
      status: 'active',
    }
    const response = await TableMiddleware.validatePatchBody(request)
    expect(response).toBeDefined()
    expect(response?.status).toEqual(400)
    expect(response?.json).toEqual({
      error: 'Invalid body',
      details: ['Invalid fields: role, status'],
    })
  })

  it('should call next if body has all fields', async () => {
    request.body = {
      name: 'name',
      email: 'email',
    }
    const response = await TableMiddleware.validatePatchBody(request)
    expect(response).toBeUndefined()
  })
})
