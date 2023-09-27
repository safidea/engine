await Bun.build({
  entrypoints: ['./src/client.tsx'],
  outdir: './dist/public',
  target: 'browser',
  minify: true,
})
