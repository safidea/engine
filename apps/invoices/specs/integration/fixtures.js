import { render, screen, act, waitForElementToBeRemoved, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { URL } from 'url'
import { Response } from 'node-fetch'
import faker from '../faker'
import Foundation from '../../app/foundation'
import orm from '../../app/orm'

const domain = 'http://localhost:3000'

// Mock next/navigation
const router = {
  push: jest.fn((/** @type {string} */ path) => path),
}
jest.mock('next/navigation', () => {
  return {
    useRouter: () => router,
    usePathname: () => '/',
  }
})

// Mock fetch
global.fetch = async (url, init) => {
  const { method = 'GET', body } = init || {}
  let params = {}
  const path = url.match(/(?<=api\/).*(?=\??)/)?.[0]
  if (!path) return {}
  const [api, p1, p2] = path.split('/')
  switch (api) {
    case 'table':
      params = { table: p1, id: p2 }
      break
    default:
      break
  }
  const parsedUrl = new URL(domain + url)
  const query = [...parsedUrl.searchParams.entries()].reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  )
  const request = { url: String(url), method, params, query }
  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) request.body = JSON.parse(body)
  const { json, status = 200 } = await Foundation.api(request)
  return new Response(JSON.stringify(json), { status })
}

export {
  render,
  screen,
  userEvent,
  router,
  faker,
  Foundation,
  act,
  orm,
  waitForElementToBeRemoved,
  within,
}
