import fs from 'fs-extra'
import { join } from 'path'

export async function getSchema() {
  const path = join(process.cwd(), process.env.FOUNDATION_APP || 'app.json')
  const schema = await fs.readJson(path, { throws: false })
  if (!schema) throw new Error(`No app json schema found at ${path}`)
  return schema
}
