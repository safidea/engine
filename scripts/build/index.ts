import fs from 'fs-extra'
import { buildServer } from './server'
import { buildSchemas } from './schemas'

const externals: string[] = []

await fs.ensureDir('dist')
await fs.emptyDir('dist')

await Promise.all([buildServer({ externals }), buildSchemas()])

process.exit(0)
