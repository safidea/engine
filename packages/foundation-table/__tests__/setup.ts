import fs from 'fs-extra'
import { join } from 'path'

const SCHEMA_PATH = join(__dirname, '..', 'prisma/test.db')

export default async function globalSetup() {
  fs.writeFileSync(SCHEMA_PATH, '')
}
