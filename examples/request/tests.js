import App from '../../dist/infrastructure/engine/index.js'
import { config } from './config.js'

const app = new App(config, { port: 3001 })
await app.test()
await app.start()
