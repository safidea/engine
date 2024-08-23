import type { CreateFromTemplate as Config } from '@adapter/api/configs/Action/document/CreateFromTemplate'
import { CreateFromTemplate } from '@domain/entities/Action/document/CreateFromTemplate'
import type { File } from '@domain/entities/File'
import type { Storage } from '@domain/services/Storage'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Zip } from '@domain/services/Zip'

interface Services {
  templateCompiler: TemplateCompiler
  zip: Zip
  file: File
  storage: Storage
}

export class CreateFromTemplateMapper {
  static toEntity = (config: Config, services: Services): CreateFromTemplate => {
    const { templateCompiler, zip, file, storage } = services
    return new CreateFromTemplate({ ...config, templateCompiler, zip, file, storage })
  }
}
