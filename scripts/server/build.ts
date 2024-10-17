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
  'nodemailer',
  'pg-boss',
  'handlebars',
  'uuid',
  'nanoid',
  'html-react-parser',
  'dompurify',
  'marked',
  'jsdom',
  'postcss',
  'autoprefixer',
  'tailwindcss',
  'jsonwebtoken',
  'react',
  'react-dom',
  '@heroicons/react',
  'exceljs',
  'adm-zip',
  '@sentry/node',
  '@sentry/profiling-node',
  'winston',
  'winston-elasticsearch',
  '@elastic/elasticsearch',
  'dotenv',
  'xml2js',
  'date-fns',
  'googleapis',
]

const entrypoints: string[] = ['index.ts', 'infrastructure/instrument/index.ts']

await deleteFilesRecursively('dist', '.js', ['public'])

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints: entrypoints.map((entry) => 'src/' + entry),
  outdir: 'dist',
  external: externals,
})
if (!success) onBunErrors('js', logs)

log('✓ Server builded')
