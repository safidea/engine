import { deleteFilesRecursively, log, onBunErrors } from '../utils'

log('Start building JS...')

const externals: string[] = [
  'ajv',
  'fs-extra',
  'puppeteer',
  'debug',
  'express',
  'cors',
  'helmet',
  'cookie-parser',
  'react',
  'react-dom',
  'better-sqlite3',
  'kysely',
]

const entrypoints = [
  'src/infrastructure/engine/index.ts',
  'src/infrastructure/engine/role.ts',
  'src/infrastructure/engine/feature.ts',
  'src/infrastructure/engine/page.ts',
  'src/infrastructure/engine/spec.ts',
  'src/infrastructure/engine/table.ts',
]

await deleteFilesRecursively('dist', '.js')

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'dist/infrastructure/engine',
  splitting: true,
  external: externals,
})
if (!success) onBunErrors('js', logs)

log('✓ JS builded')
