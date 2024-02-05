import { exec, log } from '../utils'

log('Start building CSS...')

const { NODE_ENV } = process.env

const minify = NODE_ENV === 'production' ? '--minify' : ''

await exec(
  `bunx tailwindcss -i ./src/infrastructure/components/input.css -o ./dist/public/output.css ${minify}`
)

log('✓ CSS builded')
