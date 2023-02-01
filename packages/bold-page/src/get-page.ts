import { pages } from 'bold-build'
import type { Page } from '../types/page.type'

export default function getPage(path = 'home'): Page {
  const page = pages.find((page) => page.path === path) as Page
  if (!page) throw new Error(`Their is no page for path ${path}`)
  return page
}
