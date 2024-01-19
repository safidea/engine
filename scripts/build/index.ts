import fs from 'fs-extra'
import { buildServer } from './server'

const externals: string[] = []

await fs.ensureDir('dist')
await fs.emptyDir('dist')

await Promise.all([buildServer({ externals })])

process.exit(0)
