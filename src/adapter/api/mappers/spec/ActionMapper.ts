import type { ActionDto } from '@adapter/api/dtos/spec/ActionDto'
import type { Action } from '@domain/entities/spec/Action'
import { Fill } from '@domain/entities/spec/Action/Fill'
import { Open } from '@domain/entities/spec/Action/Open'
import { Post } from '@domain/entities/spec/Action/Post'
import type { BaseParams as ActionParams } from '@domain/entities/spec/Action/base'

export class ActionMapper {
  static toEntity(dto: ActionDto, params: ActionParams): Action {
    if ('open' in dto) {
      return new Open(dto, params)
    }
    if ('fill' in dto) {
      return new Fill(dto, params)
    }
    if ('post' in dto) {
      return new Post(dto, params)
    }
    throw new Error('Unknown action')
  }

  static toEntities(dtos: ActionDto[], params: ActionParams): Action[] {
    return dtos.map((dto) => this.toEntity(dto, params))
  }
}
