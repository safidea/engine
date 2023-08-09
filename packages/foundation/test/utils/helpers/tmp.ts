import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'

export function getDedicatedTmpFolder(): string {
  const path = join(process.cwd(), `tmp/${nanoid(10)}`)
  fs.ensureDirSync(path)
  return path
}

export function clearTmpFolders(): void {
  fs.emptyDirSync(join(process.cwd(), 'tmp'))
}
