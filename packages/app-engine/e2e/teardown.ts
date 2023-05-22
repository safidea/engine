import TestUtils from 'server-common/src/utils/test.utils'
import { ProcessUtils } from 'server-common'

async function globalTeardown() {
  console.log('Running global teardown')
  TestUtils.afterAll(['server-database'])
  ProcessUtils.runCommand('docker compose -f ./e2e/docker-compose.yml down')
}

export default globalTeardown
