import fs from 'fs-extra'
import { join } from 'path'
import { DATA_FOLDER_PATH, ROOT_PATH } from '../settings/path.settings'

export function cache(name: string, options?: { dir: boolean }): string {
  const { dir = false } = options || {}
  const path = join(ROOT_PATH, DATA_FOLDER_PATH, `cache/${name}${dir ? '' : '.json'}`)
  if (dir) fs.ensureDirSync(path)
  else fs.ensureFileSync(path)
  return path
}
