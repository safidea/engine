import './config'
import { createMocks } from 'node-mocks-http'
import handleTable from '@app/api/table/[base]/[table]/route'

beforeAll(async () => {
  jest.clearAllMocks()
})

describe('/api/table', () => {
  it('returns a 200 status code', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        base: 'main',
        table: 'tasks',
      },
    })
    await handleTable(req, res)
    expect(res._getStatusCode()).toBe(200)
  })
})
