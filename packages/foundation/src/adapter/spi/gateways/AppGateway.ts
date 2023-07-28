import { AppDto } from '@application/dtos/AppDto'

export class AppGateway {
  constructor(private readonly _appDto: AppDto) {}

  get appDto(): AppDto {
    return this._appDto
  }
}
