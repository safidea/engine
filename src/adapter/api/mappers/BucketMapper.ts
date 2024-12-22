import type { IBucket } from '@adapter/api/configs/Bucket'
import type { Server } from '@domain/services/Server'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { Bucket } from '@domain/entities/Bucket'
import type { Storage } from '@domain/services/Storage'

export interface BucketMapperServices {
  server: Server
  storage: Storage
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
}

export class BucketMapper {
  static toEntity = (config: IBucket, services: BucketMapperServices) => {
    return new Bucket(config, services)
  }

  static toManyEntities = (configs: IBucket[] = [], services: BucketMapperServices) => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
