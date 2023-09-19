import { AppServices } from '../AppServices'
import { Bucket } from './Bucket'
import { BucketParams } from './BucketParams'
import { BucketServices } from './BucketServices'

export class BucketList {
  private readonly buckets: Bucket[]
  readonly services: BucketServices

  constructor(buckets: BucketParams[], services: AppServices) {
    const { storage } = services
    if (!storage) throw new Error('Storage service is required')
    this.services = { storage }
    this.buckets = buckets.map((bucket) => new Bucket(bucket, this.services))
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
