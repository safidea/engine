import fs from 'fs-extra'
import { join } from 'path'
import { getAppFolder } from '@infrastructure/utils/PathUtils'

function getSchema() {
  const path = join(getAppFolder(), 'app.json')
  const schema = fs.readJsonSync(path, { throws: false })
  if (!schema) throw new Error(`No app json schema found at ${path}`)
  return schema
}

export const schema = getSchema()
