import fs from 'fs-extra'
import { join } from 'path'

export async function get(): Promise<unknown> {
  const { CONFIG_FILE } = process.env
  if (!CONFIG_FILE) throw new Error('CONFIG_FILE not set')
  const path = join(__dirname, '../../../..', CONFIG_FILE as string)
  const exists = await fs.pathExists(path)
  if (!exists) throw new Error(`Config file not found: ${path}`)
  const file = fs.readFileSync(path, 'utf8')
  try {
    return JSON.parse(file)
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(`Error parsing config file: ${error.message}`)
  }
}
