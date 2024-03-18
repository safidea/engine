import { log, onBunErrors } from '../helpers'

log('Start building utils...')

const entrypoints = ['utils/tests/components.tsx']

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'dist/utils/tests',
})
if (!success) onBunErrors('tests', logs)

log('✓ Utils builded')
