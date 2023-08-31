import Foundation from '../../src/Foundation'
import TailwindUI from '../../src/infrastructure/ui/TailwindUI'
import SERVICES_TEMPLATE from './app'

const folder = __dirname.replace('dist/templates', 'templates')

new Foundation({ folder, adapters: { ui: TailwindUI } })
  .config(SERVICES_TEMPLATE)
  .start()
  .then((server) => {
    console.log(
      `Docs app started at http://localhost:${server.port} in ${process.env.NODE_ENV} mode`
    )
  })
  .catch((error) => {
    console.error(error)
  })
