import { promises as fs } from 'fs'
import yaml from 'js-yaml'
import { fsExists } from 'bold-utils'

import type { Config } from '../types/config.type'

export default async function loadYaml(pathToConfigFile: string): Promise<Config> {
  if (await fsExists(pathToConfigFile)) {
    return yaml.load(await fs.readFile(pathToConfigFile, 'utf8')) as Config
  } else {
    throw new Error(`Config file ${pathToConfigFile} not found.`)
  }
}
