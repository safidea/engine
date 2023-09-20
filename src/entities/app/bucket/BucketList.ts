import { StorageService } from '@entities/services/storage/StorageService'
import { AppMappers } from '../AppMappers'
import { Bucket } from './Bucket'
import { BucketParams } from './BucketParams'
import { BucketServices } from './BucketServices'

export class BucketList {
  private readonly buckets: Bucket[]
  readonly services: BucketServices

  constructor(buckets: BucketParams[], mappers: AppMappers) {
    const { storage } = mappers
    if (!storage) throw new Error('Storage is required')
    this.services = {
      storage: new StorageService(storage),
    }
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
