import { log, onBunErrors } from '../helpers'

log('Start building tests...')

const entrypoints = ['tests/__helpers__/components.tsx']

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'tests/__helpers__/dist',
})
if (!success) onBunErrors('tests', logs)

log('✓ Tests builded')
