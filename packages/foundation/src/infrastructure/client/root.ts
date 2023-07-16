interface RootOptions {
  title: string
}

export function getRootHtml(html: string, options?: RootOptions) {
  const { title } = options || {}
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body>
      <div id="root">${html}</div>
    </body>
  </html>
`
}
