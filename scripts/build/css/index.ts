import { exec, log } from '../utils'

log('✓ Start building css')

await exec('bunx tailwindcss -i ./src/domain/components/input.css -o ./dist/output.css --minify')

log('✓ Built package')
