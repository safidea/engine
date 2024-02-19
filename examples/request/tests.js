/* eslint-disable no-undef */
import App from '../../dist/infrastructure/engine/index.js'
import { config } from './config.js'

const app = new App()
const errors = await app.test(config)
if (errors.length > 0) {
  console.error(errors)
  process.exit(1)
}
await app.start(config)
