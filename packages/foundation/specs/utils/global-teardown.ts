import { join } from 'path'
import fs from 'fs-extra'

async function globalTeardown() {
  const tmpFolder = join(process.cwd(), 'specs/tmp')
  await fs.emptyDir(tmpFolder)
}

export default globalTeardown
