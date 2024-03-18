import { deleteFilesRecursively, log, onBunErrors } from '../helpers'

log('Start building server...')

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
  'pg',
  'kysely',
  'nodemailer',
  'pg-boss',
  'handlebars',
  'uuid',
  'nanoid',
]

const entrypoints = [
  'src/infrastructure/engine/index.ts',
  'src/infrastructure/engine/feature.ts',
  'src/infrastructure/engine/page.ts',
  'src/infrastructure/engine/spec.ts',
  'src/infrastructure/engine/table.ts',
  'src/infrastructure/engine/automation.ts',
]

await deleteFilesRecursively('dist/infrastructure/engine', '.js')

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'dist/infrastructure/engine',
  splitting: true,
  external: externals,
})
if (!success) onBunErrors('js', logs)

log('✓ Server builded')
