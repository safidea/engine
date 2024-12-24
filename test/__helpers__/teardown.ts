import fs from 'fs-extra'
import { join } from 'path'
import { container } from './setup'
import { cleanTestTable } from './integrations/notion'

async function globalTeardown() {
  // await cleanTestTable()
  const isUnitTest = process.argv.includes('test/unit')
  const isIntegrationTest = process.argv.includes('test/integration')
  if (isUnitTest || isIntegrationTest) return
  await container.stop()
  await fs.emptyDir(join(process.cwd(), 'tmp'))
}

export default globalTeardown
