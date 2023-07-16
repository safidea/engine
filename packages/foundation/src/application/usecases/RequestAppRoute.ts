import { AppRepository } from '@adapter/spi/repositories/AppRepository'

export class RequestAppRoute {
  constructor(private appRepository: AppRepository) {}

  async execute(): Promise<any> {
    return this.appRepository.requestRoute()
  }
}
