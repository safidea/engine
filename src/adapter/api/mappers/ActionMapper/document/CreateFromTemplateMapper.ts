import type { CreateFromTemplate as Config } from '@adapter/api/configs/Action/document/CreateFromTemplate'
import { CreateFromTemplate } from '@domain/entities/Action/document/CreateFromTemplate'
import type { FileSystem } from '@domain/services/FileSystem'
import type { File } from '@domain/entities/File'
import type { Storage } from '@domain/services/Storage'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  templateCompiler: TemplateCompiler
  fileSystem: FileSystem
  file: File
  storage: Storage
}

export class CreateFromTemplateMapper {
  static toEntity = (config: Config, services: Services): CreateFromTemplate => {
    const { templateCompiler, fileSystem, file, storage } = services
    return new CreateFromTemplate({ ...config, templateCompiler, fileSystem, file, storage })
  }
}
