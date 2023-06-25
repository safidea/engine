import NextAppServer from '../../../../server'
import { NextResponse } from 'next/server'
import url from 'url'
import querystring from 'querystring'

export async function GET(request, { params = {} }) {
  const { json, status = 200 } = await NextAppServer.apiHandler({
    method: 'GET',
    url: request.url,
    params,

    query: querystring.parse(url.parse(request.url).query),
  })
  return NextResponse.json(json, { status })
}

export async function PATCH(request, { params = {} }) {
  const { json, status = 200 } = await NextAppServer.apiHandler({
    method: 'PATCH',
    url: request.url,
    params,
    body: await request.json(),
  })
  return NextResponse.json(json, { status })
}

export async function PUT(request, { params = {} }) {
  const { json, status = 200 } = await NextAppServer.apiHandler({
    method: 'PUT',
    url: request.url,
    params,
    body: await request.json(),
  })
  return NextResponse.json(json, { status })
}

export async function DELETE(request, { params = {} }) {
  const { json, status = 200 } = await NextAppServer.apiHandler({
    method: 'DELETE',
    url: request.url,
    params,
  })
  return NextResponse.json(json, { status })
}
