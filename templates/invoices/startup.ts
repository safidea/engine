import dotenv from 'dotenv'
import { join } from 'path'
import Foundation from '../../src/Foundation'
import TailwindUI from '../../src/infrastructure/ui/TailwindUI'
import INVOICES_TEMPLATE from './app'

const folder = __dirname.replace('dist/templates', 'templates')
dotenv.config({ path: join(folder, '.env') })

new Foundation({ folder, adapters: { ui: TailwindUI } })
  .config(INVOICES_TEMPLATE)
  .start()
  .then((server) => {
    console.log(
      `Invoices app started at http://localhost:${server.port} in ${process.env.NODE_ENV} mode`
    )
  })
  .catch((error) => {
    console.error(error)
  })
