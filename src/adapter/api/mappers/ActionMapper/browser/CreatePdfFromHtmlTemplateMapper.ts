import type { CreatePdfFromHtmlTemplate as Config } from '@adapter/api/configs/Action/browser/CreatePdfFromHtmlTemplate'
import { CreatePdfFromHtmlTemplate } from '@domain/entities/Action/browser/CreatePdfFromHtmlTemplate'
import type { Browser } from '@domain/services/Browser'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { FileSystem } from '@domain/services/FileSystem'
import type { File } from '@domain/entities/File'
import type { Storage } from '@domain/services/Storage'

interface Services {
  browser: Browser
  templateCompiler: TemplateCompiler
  fileSystem: FileSystem
  file: File
  storage: Storage
}

export class CreatePdfFromHtmlTemplateMapper {
  static toEntity = (config: Config, services: Services): CreatePdfFromHtmlTemplate => {
    const { browser, templateCompiler, fileSystem, file, storage } = services
    return new CreatePdfFromHtmlTemplate({
      ...config,
      browser,
      templateCompiler,
      fileSystem,
      file,
      storage,
    })
  }
}
