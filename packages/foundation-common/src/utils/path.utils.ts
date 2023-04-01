import fs from 'fs-extra'
import { join } from 'path'

const { DATA_FOLDER } = process.env
const ROOT_PATH = join(__dirname, __dirname.search('.next') > -1 ? '../../..' : '', '../../../..')

export function prismaSchema(): string {
  const path = join(ROOT_PATH, DATA_FOLDER as string, 'prisma/schema.prisma')
  fs.ensureFileSync(path)
  return path
}

export function prismaClient(): string {
  const path = join(ROOT_PATH, 'packages/foundation-database/prisma/client')
  fs.ensureDirSync(path)
  return path
}

export function cache(name: string): string {
  const path = join(ROOT_PATH, DATA_FOLDER as string, `cache/${name}.json`)
  fs.ensureFileSync(path)
  return path
}
