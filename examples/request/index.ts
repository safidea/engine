import yaml from 'js-yaml'
import fs from 'fs'
import Engine from '@solumy/engine'

const yamlConfig = fs.readFileSync('./config.yaml', 'utf8')
const jsonConfig = yaml.load(yamlConfig)

console.log(jsonConfig)

const engine = new Engine()