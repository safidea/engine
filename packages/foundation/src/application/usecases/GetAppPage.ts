import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { ReactElement } from 'react'

export class GetAppPage {
  constructor(private appRepository: AppRepository) {}

  async execute(path: string): Promise<ReactElement> {
    return this.appRepository.getPage(path)
  }
}
