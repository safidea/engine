import { promises as fs } from 'fs'
import yaml from 'js-yaml'
import loadYaml from '../src/load-yaml'
import { folder, getDataset } from './.setup'

const dataset = getDataset()

test('should fail loading config file', async () => {
  try {
    await loadYaml('not-existing-file.yaml')
    expect(false).toBe(true)
  } catch (e) {
    expect(true).toBe(true)
  }
})

test('should load config file', async () => {
  const pathToConfigFile = folder + '/bold.config.yaml'
  await fs.writeFile(pathToConfigFile, yaml.dump(dataset))
  const loaded = await loadYaml(pathToConfigFile)
  expect(loaded).toEqual(dataset)
})
