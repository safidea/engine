import { ContextDto } from '@adapters/dtos/ContextDto'
import { Context } from '@entities/app/page/context/Context'

export class ContextMapper {
  static toContext(dto: ContextDto) {
    return new Context(dto)
  }
}
