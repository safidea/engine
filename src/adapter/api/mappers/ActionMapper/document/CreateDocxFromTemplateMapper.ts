import type { CreateDocxFromTemplate as Config } from '@adapter/api/configs/Action/document/CreateDocxFromTemplate'
import { CreateDocxFromTemplate } from '@domain/entities/Action/document/CreateDocxFromTemplate'
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

export class CreateDocxFromTemplateMapper {
  static toEntity = (
    config: Config,
    services: Services,
    entities: Entities
  ): CreateDocxFromTemplate => {
    const { templateCompiler, zip } = services
    const { buckets } = entities
    const bucket = buckets.find((bucket) => bucket.name === config.bucket)
    if (!bucket)
      throw new ConfigError({
        message: `CreateDocxFromTemplateMapper: Bucket ${config.bucket} not found`,
      })
    return new CreateDocxFromTemplate({ ...config, templateCompiler, zip, bucket })
  }
}
