import dotenv from 'dotenv'
import { checkSchema, loadYaml, buildLocales, buildConfig } from 'bold-config'

dotenv.config({ path: './.env.local' })

const file = process.env.BOLD_CONFIG_FILE || './bold.config.yaml'

;(async () => {
  console.info('Start configuring Bold...')

  const config = await loadYaml(file)
  await checkSchema(config)
  await buildLocales(config.locales, './public')
  await buildConfig(config, './src/config')

  console.info('Bold config succeed!')
})()
