import { join } from 'path'
import dotenv from 'dotenv'
import ProcessUtils from 'server-common/src/utils/process.utils'

async function globalSetup() {
  if (!process.env.FDT_APP_NAME) {
    console.log('Running global setup')
    dotenv.config({ path: join(__dirname, 'app/config.env') })
    ProcessUtils.runCommand('docker network prune -f')
    ProcessUtils.runCommand(`docker compose -f ${join(__dirname, 'docker-compose.yml')} up -d`)
    ProcessUtils.runCommand(`pnpm run config`)
  }
}

export default globalSetup
