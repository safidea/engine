import dotenv from 'dotenv'
import { checkSchema, loadYaml, buildLocales, buildConfig } from 'bold-config'
import { testComponentsUI } from 'bold-component'

dotenv.config({ path: './.env.local' })

const file = process.env.BOLD_CONFIG_FILE || './bold.config.yaml'

;(async () => {
  console.info('Start compiling Bold config...')

  const config = await loadYaml(file)
  await checkSchema(config)
  if (config.components) await testComponentsUI(config.components)
  await Promise.all([
    config.locales && buildLocales(config.locales, './public'),
    buildConfig(config, './src/config'),
  ])

  console.info('Bold config compile succeed!')
})()
