import dotenv from 'dotenv'
import { join } from 'path'
import Foundation from '../../src/Foundation'
import TailwindUI from '../../src/infrastructure/ui/TailwindUI'
import APP from './app'

const folder = __dirname.replace('dist/apps', 'apps')
dotenv.config({ path: join(folder, '.env') })

new Foundation({ folder, adapters: { ui: TailwindUI } })
  .config(APP)
  .start()
  .then((server) => {
    console.log(`Invoices app started at http://localhost:${server.port}`)
  })
  .catch((error) => {
    console.error(error)
  })
