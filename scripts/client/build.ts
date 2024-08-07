import { deleteFilesRecursively, log, onBunErrors } from '../helpers'

log('Start building client...')

await deleteFilesRecursively('dist/public', '.js')

const { success, logs } = await Bun.build({
  target: 'browser',
  entrypoints: ['src/infrastructure/client/index.ts'],
  outdir: 'dist/public',
  minify: process.env.NODE_ENV === 'production',
})
if (!success) onBunErrors('js', logs)

log('✓ Client builded')
