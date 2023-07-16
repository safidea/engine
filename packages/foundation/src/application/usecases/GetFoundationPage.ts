import { IFoundationRepository } from '@domain/repositories/IFoundationRepository'
import { ReactElement } from 'react'

export class GetFoundationPage {
  constructor(private foundationRepository: IFoundationRepository) {}

  async execute(path: string): Promise<ReactElement> {
    return this.foundationRepository.page(path)
  }
}
