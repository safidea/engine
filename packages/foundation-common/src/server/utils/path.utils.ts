import fs from 'fs-extra'
import { join } from 'path'
import { PathSettings } from '@server'

export function cache(name: string, options?: { dir: boolean }): string {
  const { dir = false } = options || {}
  const path = join(
    PathSettings.getRoot(),
    PathSettings.getConfigFile(),
    `cache/${name}${dir ? '' : '.json'}`
  )
  if (dir) fs.ensureDirSync(path)
  else fs.ensureFileSync(path)
  return path
}
