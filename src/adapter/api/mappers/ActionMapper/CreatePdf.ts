import type { CreatePdf as Config } from '@adapter/api/configs/Action/CreatePdf'
import { CreatePdf } from '@domain/entities/Action/CreatePdf'
import type { Browser } from '@domain/services/Browser'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  browser: Browser
  templateCompiler: TemplateCompiler
}

export class CreatePdfMapper {
  static toEntity = (config: Config, services: Services): CreatePdf => {
    const { browser, templateCompiler } = services
    return new CreatePdf({ ...config, browser, templateCompiler })
  }
}
