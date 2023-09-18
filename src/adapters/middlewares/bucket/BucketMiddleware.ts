import { ApiError } from '@entities/errors/ApiError'
import { BucketValidator } from '../../validators/bucket/BucketValidator'
import { Bucket } from '@entities/app/bucket/Bucket'
import { App } from '@entities/app/App'
import { ServerRequest } from '@adapters/services/server/ServerRequest'
import { ServerResponse } from '@adapters/services/server/ServerResponse'

export class BucketMiddleware {
  private readonly bucketValidator: BucketValidator

  constructor(app: App) {
    this.bucketValidator = new BucketValidator(app)
  }

  get(bucket: Bucket) {
    return async (request: ServerRequest): Promise<ServerResponse> => {
      try {
        const file = await this.bucketValidator.validateFileExist(request, bucket)
        return { file: file.path, headers: { 'Content-Type': file.mimetype } }
      } catch (error) {
        return this.catchError(error)
      }
    }
  }

  catchError(error: unknown): ServerResponse {
    if (error instanceof ApiError) {
      return { status: error.status, json: { error: error.message } }
    } else if (error instanceof Error) {
      return { status: 500, json: { error: error.message } }
    } else {
      return { status: 500, json: { error: 'Internal server error' } }
    }
  }
}
