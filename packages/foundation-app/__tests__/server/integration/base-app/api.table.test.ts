import './config'
import { GET } from '@app/api/table/[base]/[table]/route'

let request: Request
const base = 'main'
const table = 'tasks'
const context = { params: { base, table } }
const url = `http://localhost:3000/api/table/${base}/${table}`

describe('/api/table', () => {
  it('returns a 200 status code', async () => {
    request = new Request(url)
    const response = await GET(request, context)
    expect(response.status).toBe(200)
  })
})
