import { AppDto } from '@application/dtos/AppDto'
import { getSchema } from '@infrastructure/config/Schema'

export class AppRepository {
  async getSchema(): Promise<AppDto> {
    return getSchema()
  }
}
