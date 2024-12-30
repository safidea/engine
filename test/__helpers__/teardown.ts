import fs from 'fs-extra'
import { join } from 'path'
import { container } from './setup'
import { cleanTestTable } from '@test/integration/notion'

async function globalTeardown() {
  const isUnitTest = process.argv.includes('test/unit')
  if (isUnitTest) return

  await cleanTestTable()
  const isIntegrationTest = process.argv.includes('test/integration')
  if (isIntegrationTest) return

  await container.stop()
  await fs.emptyDir(join(process.cwd(), 'tmp'))
}

export default globalTeardown
