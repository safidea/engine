import Engine from '../../src/Engine'
import TailwindUI from '../../src/infrastructure/ui/TailwindUI'
import DOCS_TEMPLATE from './app'

const folder = __dirname.replace('dist/templates', 'templates')

new Engine({ folder, adapters: { ui: TailwindUI } })
  .config(DOCS_TEMPLATE)
  .start()
  .then((server) => {
    console.log(
      `Docs app started at http://localhost:${server.port} in ${process.env.NODE_ENV} mode`
    )
  })
  .catch((error) => {
    console.error(error)
  })
