import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import fs from 'fs-extra'

export function getDedicatedTmpFolder(): string {
  const path = join(__dirname, `../tmp/${uuidv4()}`)
  fs.ensureDirSync(path)
  return path
}

export function clearTmpFolders(): void {
  fs.emptyDirSync(join(__dirname, '../tmp'))
}
