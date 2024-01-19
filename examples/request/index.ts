import yaml from 'js-yaml'
import fs from 'fs'
import Engine from '@solumy/engine'

const yamlConfig = fs.readFileSync('./request.app.yaml', 'utf8')
const jsonConfig = yaml.load(yamlConfig)

const engine = new Engine(jsonConfig)
console.log(engine.errors)
