import yaml from 'js-yaml'
import fs from 'fs-extra'
import { join } from 'path'

// eslint-disable-next-line no-undef
const yamlConfig = fs.readFileSync(join(process.cwd(), 'examples/request/request.yaml'), 'utf8')
export const config = yaml.load(yamlConfig)
