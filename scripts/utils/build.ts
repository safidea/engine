import { log, onBunErrors } from '../helpers'

log('Start building utils...')

const entrypoints = ['tests/utils/components.tsx']

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'tests/utils/dist',
})
if (!success) onBunErrors('tests', logs)

log('✓ Utils builded')
