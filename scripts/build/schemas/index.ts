import fs from 'fs-extra'
import { capitalize, exec, log } from '../utils'

log(`Start building schemas...`)

const schemas = ['app', 'role', 'feature', 'page', 'spec', 'table']

await fs.ensureDir('schemas')
await fs.emptyDir('schemas')

async function buildSchema(schema: string) {
  await exec(
    `bunx typescript-json-schema ./tsconfig.json ${capitalize(schema)} --out ./schemas/${schema}.schema.json --required --noExtraProps`
  )
  log(`✓ ${capitalize(schema)} schema builded`)
}

const promises = []
for (const schema of schemas) {
  promises.push(buildSchema(schema))
}
await Promise.all(promises)
