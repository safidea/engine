import { AppDto } from '@application/dtos/AppDto'

export class AppRepository {
  constructor(private readonly _appDto: AppDto) {
    if (_appDto.automations)
      throw new Error('field X in automation A is not defined in table "invoices"')
  }

  get appDto(): AppDto {
    return this._appDto
  }
}
