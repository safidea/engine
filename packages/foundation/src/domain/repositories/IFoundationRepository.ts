import { ReactElement } from 'react'

export interface IFoundationRepository {
  page(path: string): Promise<ReactElement>
  route(): Promise<any>
}
