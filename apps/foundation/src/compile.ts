import dotenv from 'dotenv'
import { checkSchema, loadYaml, buildLocales, buildConfig } from 'foundation-config'
import { testComponentsUI } from 'foundation-component'

dotenv.config({ path: './.env.local' })

const file = process.env.FOUNDATION_CONFIG_FILE || './foundation.config.yaml'

;(async () => {
  console.info('Start compiling foundation config...')

  const config = await loadYaml(file)
  await checkSchema(config)
  if (config.components) await testComponentsUI(config.components)
  await Promise.all([
    config.locales && buildLocales(config.locales, './public'),
    buildConfig(config, './src/config'),
  ])

  console.info('foundation config compile succeed!')
})()
