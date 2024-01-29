import { createApp } from '@solumy/engine'
import { config } from './config'

const { app } = await createApp(config, { port: 3001 })

if (app) {
  await app.start()
} else {
  console.error('Failed to start application')
}
