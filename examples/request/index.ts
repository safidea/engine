import yaml from 'js-yaml'
import fs from 'fs-extra'
import { join } from 'path'
import { createApp } from '@solumy/engine'

const dirname = new URL('.', import.meta.url).pathname
const yamlConfig = fs.readFileSync(join(dirname, 'request.yaml'), 'utf8')
const jsonConfig = yaml.load(yamlConfig)

const { app } = await createApp(jsonConfig, { port: 3000 })

if (app) {
  await app.start()
}
