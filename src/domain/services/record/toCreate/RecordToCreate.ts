import type { RecordToCreateDto } from './RecordToCreateDto'
import type { RecordToCreateParams } from './RecordToCreateParams'

export class RecordToCreate {
  public data: RecordToCreateDto

  constructor(dto: Partial<RecordToCreateDto>, params: RecordToCreateParams) {
    this.data = {
      ...dto,
      id: params.idGenerator.forRecord(),
      created_at: new Date(),
    }
  }
}
