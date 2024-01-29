import yaml from 'js-yaml'
import fs from 'fs-extra'
import { join } from 'path'

const dirname = new URL('.', import.meta.url).pathname
const yamlConfig = fs.readFileSync(join(dirname, 'request.yaml'), 'utf8')
export const config = yaml.load(yamlConfig)
