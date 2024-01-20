import { log, onBunErrors } from './utils'

export async function buildServer({ externals }: { externals: string[] }) {
  const entrypoints = ['src/app.ts', 'src/role.ts']
  const { success, logs } = await Bun.build({
    target: 'node',
    entrypoints,
    outdir: 'dist',
    splitting: true,
    external: externals,
  })
  if (!success) onBunErrors('server', logs)
  log('✓ Built server')
}
