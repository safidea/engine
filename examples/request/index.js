import App from '../../dist/infrastructure/engine/index.js'
import { config } from './config.js'

const app = new App(config, { port: 3000 })
await app.start()
