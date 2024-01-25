import { exec, log } from '../utils'

log('Start building CSS...')

await exec('bunx tailwindcss -i ./src/domain/components/input.css -o ./dist/output.css --minify')

log('✓ CSS builded')
