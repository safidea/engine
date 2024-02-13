import { TestError } from '@domain/entities/error/Test'
import { BaseWithRequest, type BaseParams } from './base'

interface Params extends BaseParams {
  post: string
  body: object
}

export class Post extends BaseWithRequest {
  constructor(private params: Params) {
    super()
  }

  executeWithRequest = async (baseUrl: string) => {
    const { post, body, logger, feature, spec } = this.params
    logger.log(`posting "${JSON.stringify(body)}" to "${post}"`)
    const res = await fetch(`${baseUrl}${post}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new TestError({
        code: 'POST_REQUEST_ERROR',
        feature,
        spec,
        expected: 200,
        received: res.status,
      })
    }
  }
}
