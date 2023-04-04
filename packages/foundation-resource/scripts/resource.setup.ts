import fs from 'fs-extra'
import debug from 'debug'
import { join } from 'path'
import { ConfigService } from 'foundation-common'
import * as SchemaSetup from 'foundation-common/scripts/schema.setup'

import type { Config } from '../types'

const GENERATED_FOLDER = '../generated'
const log: debug.IDebugger = debug('resource:setup')

type ResourceSetup = {
  isUpdated: boolean
  resource: string
}[]

export default async function ResourceSetup(): Promise<ResourceSetup> {
  const { resources } = (await ConfigService.get()) as Config
  const resourcesNames = Object.keys(resources)

  const updates = await Promise.all(
    resourcesNames.map(async (resourceName) => {
      const resource = resources[resourceName]
      const isUpdated = await SchemaSetup.cache(resource, 'resources/' + resourceName)
      if (!isUpdated) {
        log(`${resourceName} resource is up to date`)
      } else {
        if (resource.type === 'javascript') {
          const path = join(__dirname, GENERATED_FOLDER, resourceName + '.js')
          await fs.ensureFile(path)
          fs.writeFileSync(path, resource.source)
        }
        log(`${resourceName} resource has been updated`)
      }
      return {
        isUpdated,
        resource: resourceName,
      }
    })
  )

  return updates
}
