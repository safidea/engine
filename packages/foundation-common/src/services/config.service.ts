import fs from 'fs-extra'
import { PathUtils } from '../'

export async function get(): Promise<unknown> {
  const path = PathUtils.config()
  const exists = await fs.pathExists(path)
  if (!exists) throw new Error(`Config file not found: ${path}`)
  const file = fs.readFileSync(path, 'utf8')
  try {
    return JSON.parse(file)
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(`Error parsing config file: ${error.message}`)
  }
}
