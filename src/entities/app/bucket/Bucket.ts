import { AppServices } from '../App'
import { BucketParams } from './BucketParams'

export class Bucket {
  readonly name: string

  constructor(
    readonly params: BucketParams,
    readonly services: AppServices
  ) {
    const { name } = params
    this.name = name
  }
}
