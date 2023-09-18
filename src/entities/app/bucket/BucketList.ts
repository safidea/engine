import { AppServices } from '../App'
import { Bucket } from './Bucket'
import { BucketParams } from './BucketParams'

export class BucketList {
  buckets: Bucket[]

  constructor(buckets: BucketParams[], services: AppServices) {
    this.buckets = buckets.map((bucket) => new Bucket(bucket, services))
  }

  getByName(bucketName: string): Bucket | undefined {
    return this.buckets.find((t: Bucket) => t.name === bucketName)
  }

  getAll(): Bucket[] {
    return this.buckets
  }

  getAllParams(): BucketParams[] {
    return this.buckets.map((bucket: Bucket) => bucket.params)
  }

  getNames(): string[] {
    return this.buckets.map((bucket: Bucket) => bucket.name)
  }

  exist(): boolean {
    return this.buckets.length > 0
  }
}
