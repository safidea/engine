import { exec, log } from '../helpers'

log('Start building styles...')

const minify = process.env.NODE_ENV === 'production' ? '--minify' : ''

await exec(
  `bunx tailwindcss -i ./src/infrastructure/components/input.css -o ./dist/public/output.css ${minify}`
)

log('✓ Styles builded')
