import './config'
import { GET } from '@app/api/table/[base]/[table]/route'

const request = { json: () => ({}) } as unknown as Request
const context = {
  params: {
    base: 'main',
    table: 'tasks',
  },
}

describe('/api/table', () => {
  it('returns a 200 status code', async () => {
    const response = await GET(request, context)
    expect(response.status).toBe(200)
  })
})
