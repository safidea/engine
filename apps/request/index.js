import App from '../../dist/infrastructure/engine/index.js'
import { config } from './config.js'

const app = new App()
await app.start(config)