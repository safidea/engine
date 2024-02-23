import { BucketParams } from './BucketParams'
import { BucketServices } from './BucketServices'

export class Bucket {
  readonly name: string

  constructor(
    readonly params: BucketParams,
    readonly services: BucketServices
  ) {
    const { name } = params
    this.name = name
  }
}
