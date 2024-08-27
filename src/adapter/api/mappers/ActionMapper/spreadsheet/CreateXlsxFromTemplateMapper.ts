import type { CreateXlsxFromTemplate as Config } from '@adapter/api/configs/Action/spreadsheet/CreateXlsxFromTemplate'
import { CreateXlsxFromTemplate } from '@domain/entities/Action/spreadsheet/CreateXlsxFromTemplate'
import type { Bucket } from '@domain/entities/Bucket'
import { ConfigError } from '@domain/entities/Error/Config'
import type { Excel } from '@domain/services/Excel'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  templateCompiler: TemplateCompiler
  excel: Excel
}

interface Entities {
  buckets: Bucket[]
}

export class CreateXlsxFromTemplateMapper {
  static toEntity = (
    config: Config,
    services: Services,
    entities: Entities
  ): CreateXlsxFromTemplate => {
    const { templateCompiler, excel } = services
    const { buckets } = entities
    const bucket = buckets.find((bucket) => bucket.name === config.bucket)
    if (!bucket)
      throw new ConfigError({
        message: `CreateXlsxFromTemplateMapper: Bucket ${config.bucket} not found`,
      })
    return new CreateXlsxFromTemplate({ ...config, templateCompiler, excel, bucket })
  }
}
