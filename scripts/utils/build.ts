import { log, onBunErrors } from '../helpers'

log('Start building utils...')

const entrypoints = ['tests/__utils__/components.tsx']

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'tests/__utils__/dist',
})
if (!success) onBunErrors('tests', logs)

log('✓ Utils builded')
