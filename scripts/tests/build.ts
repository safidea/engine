import { log, onBunErrors } from '../helpers'
import fs from 'fs-extra'

log('Start building tests...')

const entrypoints = ['tests/__helpers__/components.tsx']

fs.copySync('tests/__helpers__/docs', 'dist/docs')

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'tests/__helpers__/dist',
})
if (!success) onBunErrors('tests', logs)

log('✓ Tests builded')
