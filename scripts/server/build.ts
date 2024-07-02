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
  'better-sqlite3',
  'pg',
  'kysely',
  'nodemailer',
  'pg-boss',
  'handlebars',
  'uuid',
  'nanoid',
  'html-react-parser',
  'dompurify',
  'marked',
]

const entrypoints: string[] = [
  'index.ts',
  'feature.ts',
  'page.ts',
  'spec.ts',
  'table.ts',
  'automation.ts',
]

await deleteFilesRecursively('dist', '.js', ['public'])

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints: entrypoints.map((entry) => 'src/' + entry),
  outdir: 'dist',
  splitting: true,
  external: externals,
})
if (!success) onBunErrors('js', logs)

log('✓ Server builded')
