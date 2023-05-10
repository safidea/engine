import TableRoute from '@table/server/routes/table.route'

import type { RouteHandlerContextType } from '@common/server'

jest.mock('@common/server/utils/route.utils')

const { GET, POST, PATCH, PUT, DELETE } = TableRoute
const req = {
  json: jest.fn(),
} as unknown as Request
const context: RouteHandlerContextType = {
  params: {
    id: '1',
  },
}

describe('get', () => {
  it('should return array of middleware with id param', async () => {
    const response = await GET(req, context)
    expect(response).toHaveLength(4)
  })
  it('should return array of middleware', async () => {
    context.params = {}
    const response = await GET(req, context)
    expect(response).toHaveLength(3)
  })
})

describe('post', () => {
  it('should return array of middleware', async () => {
    const response = await POST(req, context)
    expect(response).toHaveLength(4)
  })
})

describe('patch', () => {
  it('should return array of middleware', async () => {
    const response = await PATCH(req, context)
    expect(response).toHaveLength(5)
  })
})

describe('put', () => {
  it('should return array of middleware', async () => {
    const response = await PUT(req, context)
    expect(response).toHaveLength(5)
  })
})

describe('delete', () => {
  it('should return array of middleware', async () => {
    const response = await DELETE(req, context)
    expect(response).toHaveLength(4)
  })
})
