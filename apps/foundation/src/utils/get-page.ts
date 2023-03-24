import { pages } from '../config'
import type { Page } from 'foundation-config'

export default function getPage(path = 'home'): Page {
  const page = pages.find((page) => page.path === path) as Page
  if (!page) throw new Error(`Their is no page for path ${path}`)
  return page
}
