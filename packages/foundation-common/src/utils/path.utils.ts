import fs from 'fs-extra'
import { join } from 'path'

const DEFAULT_DATA_FOLDER = 'data'
const ROOT_PATH = join(__dirname, __dirname.search('.next') > -1 ? '../../..' : '', '../../../..')

export function config(): string {
  const { CONFIG_FILE } = process.env
  if (!CONFIG_FILE) throw new Error('CONFIG_FILE not set')
  return join(ROOT_PATH, CONFIG_FILE as string)
}

export function prismaSchema(): string {
  const { DATA_FOLDER = DEFAULT_DATA_FOLDER } = process.env
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
  const { DATA_FOLDER = DEFAULT_DATA_FOLDER } = process.env
  const path = join(ROOT_PATH, DATA_FOLDER as string, `cache/${name}.json`)
  fs.ensureFileSync(path)
  return path
}
