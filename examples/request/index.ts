import yaml from 'js-yaml'
import fs from 'fs-extra'
import { join } from 'path'
import { createApp } from '@solumy/engine'

const dirname = new URL('.', import.meta.url).pathname
const yamlConfig = fs.readFileSync(join(dirname, 'request.yaml'), 'utf8')
const jsonConfig = yaml.load(yamlConfig)

const { app, errors } = createApp(jsonConfig)

if (app) {
  await app.testFeaturesSpecs()
  await app.start()
} else {
  console.error(errors)
}
