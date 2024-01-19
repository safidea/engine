import { log, onBunErrors, fixBunNodeBuild } from './utils'

export async function buildServer({ externals }: { externals: string[] }) {
  const { success, logs } = await Bun.build({
    target: 'node',
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    external: externals,
  })
  if (!success) onBunErrors('server', logs)
  await fixBunNodeBuild('dist/index.js')
  log('✓ Built server')
}
