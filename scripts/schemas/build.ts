import fs from 'fs-extra'
import { capitalize, exec, log } from '../helpers'
import { schemas } from '@domain/schemas'

log(`Start building schemas...`)

await fs.ensureDir('schemas')
await fs.emptyDir('schemas')

async function buildSchema(schema: string) {
  await exec(
    `bunx typescript-json-schema ./tsconfig.json ${capitalize(schema)}Schema --out ./schemas/${schema}.schema.json --required --noExtraProps --strictNullChecks`
  )
  log(`✓ ${capitalize(schema)} schema builded`)
}

const promises = []
for (const schema of schemas) {
  promises.push(buildSchema(schema))
}
await Promise.all(promises)
