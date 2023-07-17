import { AppDto } from '@application/dtos/AppDto'

export class AppRepository {
  constructor(private schema: AppDto) {}

  getSchema(): AppDto {
    return this.schema
  }
}
