await Bun.build({
  entrypoints: ['./src/server.ts'],
  outdir: './dist',
  target: 'node',
  minify: true,
})
