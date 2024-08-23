import type { CreateFromTemplate as Config } from '@adapter/api/configs/Action/document/CreateFromTemplate'
import { CreateFromTemplate } from '@domain/entities/Action/document/CreateFromTemplate'
import type { Bucket } from '@domain/entities/Bucket'
import { ConfigError } from '@domain/entities/Error/Config'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Zip } from '@domain/services/Zip'

interface Services {
  templateCompiler: TemplateCompiler
  zip: Zip
}

interface Entities {
  buckets: Bucket[]
}

export class CreateFromTemplateMapper {
  static toEntity = (
    config: Config,
    services: Services,
    entities: Entities
  ): CreateFromTemplate => {
    const { templateCompiler, zip } = services
    const { buckets } = entities
    const bucket = buckets.find((bucket) => bucket.name === config.bucket)
    if (!bucket)
      throw new ConfigError({
        message: `CreateFromTemplateMapper: Bucket ${config.bucket} not found`,
      })
    return new CreateFromTemplate({ ...config, templateCompiler, zip, bucket })
  }
}
