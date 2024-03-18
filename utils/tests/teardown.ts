import fs from 'fs-extra'
import { join } from 'path'

async function globalTeardown() {
  await fs.emptyDir(join(process.cwd(), 'tmp'))
}

export default globalTeardown
