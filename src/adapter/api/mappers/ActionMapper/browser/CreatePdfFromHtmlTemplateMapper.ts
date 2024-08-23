import type { CreatePdfFromHtmlTemplate as Config } from '@adapter/api/configs/Action/browser/CreatePdfFromHtmlTemplate'
import { CreatePdfFromHtmlTemplate } from '@domain/entities/Action/browser/CreatePdfFromHtmlTemplate'
import type { Browser } from '@domain/services/Browser'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { FileSystem } from '@domain/services/FileSystem'
import type { Bucket } from '@domain/entities/Bucket'
import { ConfigError } from '@domain/entities/Error/Config'

interface Services {
  browser: Browser
  templateCompiler: TemplateCompiler
  fileSystem: FileSystem
}

interface Entities {
  buckets: Bucket[]
}

export class CreatePdfFromHtmlTemplateMapper {
  static toEntity = (
    config: Config,
    services: Services,
    entities: Entities
  ): CreatePdfFromHtmlTemplate => {
    const { browser, templateCompiler, fileSystem } = services
    const { buckets } = entities
    const bucket = buckets.find((bucket) => bucket.name === config.bucket)
    if (!bucket)
      throw new ConfigError({
        message: `CreatePdfFromHtmlTemplateMapper: Bucket ${config.bucket} not found`,
      })
    return new CreatePdfFromHtmlTemplate({
      ...config,
      browser,
      templateCompiler,
      fileSystem,
      bucket,
    })
  }
}
