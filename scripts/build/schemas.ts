import fs from 'fs-extra'
import { capitalize, exec, log } from './utils'

export async function buildSchemas() {
  const schemas = ['app']
  await fs.ensureDir('schemas')
  await fs.emptyDir('schemas')
  for (const schema of schemas) {
    await exec(
      `bunx typescript-json-schema ./tsconfig.json I${capitalize(schema)} --out ./schemas/${schema}.schema.json --required --propOrder --constAsEnum`
    )
    log(`✓ Built ${schema} schema`)
  }
}
