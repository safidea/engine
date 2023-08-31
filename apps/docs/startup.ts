import Foundation from '../../src/Foundation'
import TailwindUI from '../../src/infrastructure/ui/TailwindUI'
import DOCS_APP from './app'

const folder = __dirname.replace('dist/apps', 'apps')

new Foundation({ folder, adapters: { ui: TailwindUI } })
  .config(DOCS_APP)
  .start()
  .then((server) => {
    console.log(
      `Docs app started at http://localhost:${server.port} in ${process.env.NODE_ENV} mode`
    )
  })
  .catch((error) => {
    console.error(error)
  })
