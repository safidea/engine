import debug from 'debug'
import { ConfigUtils, ObjectUtils, SchemaUtils } from '@common/server'
import { FeatureInterfaceSchema } from '@feature'

import type { FeaturesInterface } from '@feature'
import type { ConfigInterface } from '@common'

const log = debug('feature:config')

class FeatureConfig implements ConfigInterface {
  public enrich(): void {
    const features = this.get()
    if (!features || typeof features !== 'object' || ObjectUtils.isEmpty(features)) {
      log('set default features')
    }
  }

  public validate(): void {
    const features = this.get()
    const schema = new SchemaUtils(FeatureInterfaceSchema)
    for (const feature in features) {
      log(`validate schema ${feature}`)
      schema.validate(features[feature])
    }
  }

  public lib(): void {
    const features = this.get()
    for (const feature in features) {
      log(`setup lib ${feature}`)
    }
  }

  public js(): void {
    const features = this.get()
    for (const feature in features) {
      log(`build js ${feature}`)
    }
  }

  private get(): FeaturesInterface {
    return ConfigUtils.get('features') as FeaturesInterface
  }
}

export default new FeatureConfig()
