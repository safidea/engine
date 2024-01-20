import fs from 'fs-extra'
import { capitalize, exec, log } from './utils'

export async function buildSchemas() {
  const schemas = ['app', 'role']
  await fs.ensureDir('schemas')
  await fs.emptyDir('schemas')
  const promises = []
  for (const schema of schemas) {
    promises.push(
      exec(
        `bunx typescript-json-schema ./tsconfig.json I${capitalize(schema)} --out ./schemas/${schema}.schema.json --required --noExtraProps`
      ).then(() => log(`✓ Built ${schema} schema`))
    )
  }
  return Promise.all(promises)
}
