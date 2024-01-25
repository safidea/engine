import yaml from 'js-yaml'
import fs from 'fs-extra'
import { join } from 'path'
import { createApp } from '@solumy/engine'

const dirname = new URL('.', import.meta.url).pathname
const yamlConfig = fs.readFileSync(join(dirname, 'request.yaml'), 'utf8')
const jsonConfig = yaml.load(yamlConfig)

const { app, errors } = createApp(jsonConfig, { port: 3000 })

if (app) {
  const errors = await app.testFeaturesSpecs()
  if (errors.length === 0) {
    await app.start()
  } else {
    console.log(JSON.stringify(errors, null, 2))
  }
} else {
  console.log(JSON.stringify(errors, null, 2))
}
