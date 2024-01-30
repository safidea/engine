import type { IMappers } from './IMappers'
import { IdGenerator } from './idGenerator/IdGenerator'

export class Services {
  constructor(private mappers: IMappers) {}

  get idGenerator() {
    return new IdGenerator(this.mappers.idGenerator)
  }
}
