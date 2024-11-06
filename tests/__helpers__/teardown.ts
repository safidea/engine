import fs from 'fs-extra'
import { join } from 'path'
import { container } from './setup'

async function globalTeardown() {
  const isUnitTest = process.argv.includes('tests/unit')
  if (isUnitTest) return
  await container.stop()
  await fs.emptyDir(join(process.cwd(), 'tmp'))
}

export default globalTeardown
