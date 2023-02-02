import { pages } from '../config'

export default function getPaths(): string[] {
  return pages.map((page) => page.path)
}
