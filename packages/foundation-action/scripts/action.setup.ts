import fs from 'fs-extra'
import debug from 'debug'
import { join } from 'path'
import { ConfigService } from 'foundation-common'
import * as SchemaSetup from 'foundation-common/scripts/schema.setup'
import { ResourceService } from 'foundation-resource'

import type { Config } from '../types'

const GENERATED_FOLDER = '../generated'
const log: debug.IDebugger = debug('action:setup')

type ActionSetup = {
  isUpdated: boolean
  action: string
}[]

export default async function ActionSetup(): Promise<ActionSetup> {
  const { actions } = (await ConfigService.get()) as Config
  const actionsName = Object.keys(actions)

  const updates = await Promise.all(
    actionsName.map(async (actionName) => {
      const action = actions[actionName].implementation
      const isUpdated = await SchemaSetup.cache(action, 'actions/' + actionName)
      if (!isUpdated) {
        log(`${actionName} action is up to date`)
      } else {
        if (action.type === 'javascript') {
          const path = join(__dirname, GENERATED_FOLDER, actionName + '.js')
          const requires = ResourceService.get(action.resources ?? [])
          await fs.ensureFile(path)
          fs.writeFileSync(
            path,
            `${requires}\n\nmodule.exports = async function (input) {${action.source}}`
          )
        }
        log(`${actionName} action has been updated`)
      }
      return {
        isUpdated,
        action: actionName,
      }
    })
  )

  return updates
}
