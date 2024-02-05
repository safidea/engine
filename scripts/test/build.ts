import { log, onBunErrors } from '../utils'

log('Start building tests...')

const entrypoints = ['utils/tests/components.tsx']

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'dist/utils/tests',
})
if (!success) onBunErrors('tests', logs)

log('✓ Tests builded')
