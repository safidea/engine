import { join } from 'path'
import fs from 'fs-extra'

async function globalTeardown() {
  const tmpFolder = join(__dirname, '../tmp')
  await fs.emptyDir(tmpFolder)
}

export default globalTeardown
