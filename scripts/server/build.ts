import { deleteFilesRecursively, log, onBunErrors } from '../helpers'
import fs from 'fs-extra'

log('Start building server...')

console.log(fs.readJSONSync('tsconfig.json'))

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
  'jsdom',
  'postcss',
  'autoprefixer',
  'tailwindcss',
  'jsonwebtoken',
  'react',
  'react-dom',
  '@heroicons/react',
]

const entrypoints: string[] = ['index.ts']

await deleteFilesRecursively('dist', '.js', ['public'])

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints: entrypoints.map((entry) => 'src/' + entry),
  outdir: 'dist',
  external: externals,
  minify: process.env.NODE_ENV === 'production',
})
if (!success) onBunErrors('js', logs)

log('✓ Server builded')
