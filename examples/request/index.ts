import App from '@solumy/engine'
import { config } from './config'

const app = new App(config, { port: 3000 })
await app.start()
