import { promises as fs } from 'fs'
import yaml from 'js-yaml'
import loadYaml from '../src/load-yaml'
import { config, folder } from './setup'

test('should fail loading config file', async () => {
  await expect(loadYaml('not-existing-file.yaml')).rejects.toBeDefined()
})

test('should load config file', async () => {
  const pathToConfigFile = folder + '/bold.config.yaml'
  await fs.writeFile(pathToConfigFile, yaml.dump(config))
  const loaded = await loadYaml(pathToConfigFile)
  expect(loaded).toEqual(config)
})
