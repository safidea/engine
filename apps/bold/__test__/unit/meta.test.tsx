jest.mock('../../src/config', () => jest.requireActual('../../__mocks__/config'))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
jest.mock('next/router', () => require('next-router-mock'))
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>
    },
  }
})

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Meta from '../../src/components/meta'
import { pages } from '../../src/config'
import { Page } from 'foundation-page'

const { meta } = pages[0] as Page

beforeEach(() => {
  render(<Meta {...meta} />)
})

test('should render the title', () => {
  expect(document.title).toBe(meta.title)
})

test('should render the description', () => {
  const content = document.querySelector('meta[name="description"]')?.getAttribute('content')
  expect(content).toBe(meta.description)
})

test('should render the keywords', () => {
  const content = document.querySelector('meta[name="keywords"]')?.getAttribute('content')
  expect(content).toBe(meta.keywords)
})

test('should render the author', () => {
  const content = document.querySelector('meta[name="author"]')?.getAttribute('content')
  expect(content).toBe(meta.author)
})

test('should render the twitter', () => {
  const content = document.querySelector('meta[name="twitter:site"]')?.getAttribute('content')
  expect(content).toBe(meta.twitter)
})

test('should render the image', () => {
  const content = document.querySelector('meta[property="og:image"]')?.getAttribute('content')
  expect(content).toBe((meta.domain ?? '') + (meta.image ?? ''))
})

test('should render robots', () => {
  const content = document.querySelector('meta[name="robots"]')?.getAttribute('content')
  expect(content).toBe(meta.robots)
})
