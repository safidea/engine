import fs from 'fs-extra'
import { capitalize, exec, log } from '../helpers'

log(`Start building schema...`)

const schemas = ['app']

await fs.ensureDir('schema')

async function buildSchema(schema: string) {
  await exec(
    `bunx typescript-json-schema ./script/schema/tsconfig.json ${capitalize(schema)}Schema --out ./schema/${schema}.schema.json --required --noExtraProps --strictNullChecks`
  )
  log(`✓ ${capitalize(schema)} schema builded`)
}

const promises = []
for (const schema of schemas) {
  promises.push(buildSchema(schema))
}
await Promise.all(promises)
