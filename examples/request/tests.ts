import App from '@solumy/engine'
import { config } from './config'

const app = new App(config, { port: 3001 })
await app.test()
await app.start()
