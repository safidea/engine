import { AppDto } from '@application/dtos/AppDto'

export class AppRepository {
  constructor(private schema: AppDto) {}

  async getSchema(): Promise<AppDto> {
    return this.schema
  }
}
