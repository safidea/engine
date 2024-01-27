import { deleteFilesRecursively, log, onBunErrors } from '../utils'

log('Start building tests...')

const entrypoints = ['tests/__helpers__/components.tsx']

await deleteFilesRecursively('tests/dist', '.js')

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'tests/dist',
})
if (!success) onBunErrors('tests', logs)

log('✓ Tests builded')
