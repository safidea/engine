import dotenv from 'dotenv'
import { checkSchema, loadYaml } from 'bold-config'

dotenv.config({ path: './.env.local' })

const file = process.env.BOLD_CONFIG_FILE || './bold.config.yaml'

;(async () => {
  const config = await loadYaml(file)

  checkSchema(config)
})()
