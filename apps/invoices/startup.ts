import Foundation from '../../src/Foundation'
import APP from './app'

const folder = __dirname.replace('dist/apps', 'apps')

new Foundation({ folder })
  .config(APP)
  .start()
  .then((server) => {
    console.log(`Invoices app started at http://localhost:${server.port}`)
  })
