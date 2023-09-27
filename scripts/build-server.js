await Bun.build({
  entrypoints: ['./src/server.ts'],
  outdir: './dist',
  target: 'bun',
  minify: true,
})
