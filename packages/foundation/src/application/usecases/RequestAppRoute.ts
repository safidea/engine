import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { ResponseDto } from '@application/dtos/ResponseDto'

export class RequestAppRoute {
  constructor(private appRepository: AppRepository) {}

  async execute(): Promise<ResponseDto> {
    return this.appRepository.requestRoute()
  }
}
