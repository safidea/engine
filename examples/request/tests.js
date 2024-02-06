/* eslint-disable no-undef */
import App from '../../dist/infrastructure/engine/index.js'
import { config } from './config.js'

const app = new App(config)
const errors = await app.test()
if (errors.length > 0) {
  console.error(errors)
  process.exit(1)
}
await app.start()
