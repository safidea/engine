import { pages } from 'bold-build'

export default function getPaths(): string[] {
  return pages.map((page) => page.path)
}
