import { deleteFilesRecursively, log, onBunErrors } from '../utils'

log('✓ Start building package')

const externals: string[] = ['ajv', 'fs-extra', 'puppeteer']

const entrypoints = [
  'src/app.ts',
  'src/role.ts',
  'src/feature.ts',
  'src/page.ts',
  'src/spec.ts',
  'src/component.ts',
]

await deleteFilesRecursively('dist', '.js')

const { success, logs } = await Bun.build({
  target: 'node',
  entrypoints,
  outdir: 'dist',
  splitting: true,
  external: externals,
})
if (!success) onBunErrors('package', logs)

log('✓ Built package')
