import { join } from 'path'
import ProcessUtils from 'server-common/src/utils/process.utils'
import TestUtils from 'server-common/src/utils/test.utils'

async function globalSetup() {
  if (!process.env.FDT_APP_NAME) {
    console.log('Running global setup')
    TestUtils.setupAppEnv(__dirname, 'app-engine-e2e')
    ProcessUtils.runCommand('docker network prune -f')
    ProcessUtils.runCommand(`docker compose -f ${join(__dirname, 'docker-compose.yml')} up -d`)
    ProcessUtils.runCommand(`pnpm run config`)
  }
}

export default globalSetup
