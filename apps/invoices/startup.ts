import Foundation from '../../src/Foundation'
import TailwindUI from '../../src/infrastructure/ui/TailwindUI'
import APP from './app'

const folder = __dirname.replace('dist/apps', 'apps')

new Foundation({ folder, adapters: { ui: TailwindUI } })
  .config(APP)
  .start()
  .then((server) => {
    console.log(`Invoices app started at http://localhost:${server.port}`)
  })
