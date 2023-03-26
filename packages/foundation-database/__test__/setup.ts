import fs from 'fs-extra'
import { join } from 'path'
import { execSync } from 'child_process'

const SCHEMA_PATH = join(__dirname, '..', 'prisma/test.db')
const ENV_PATH = join(__dirname, '..', '__test__/.env.test')

export default async function globalSetup() {
  try {
    fs.writeFileSync(SCHEMA_PATH, '')
    execSync(`cross-env $(cat ${ENV_PATH} | xargs) pnpm run setup && prisma db push`)
  } catch (error) {
    throw new Error('Error creating database: ' + error)
  }
}
