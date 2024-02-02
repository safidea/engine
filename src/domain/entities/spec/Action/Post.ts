import { SpecError } from '../SpecError'
import { BaseWithRequest, type BaseParams } from './base'

export interface PostConfig {
  post: string
  body: object
}

export class Post extends BaseWithRequest {
  constructor(
    private config: PostConfig,
    private params: BaseParams
  ) {
    super()
  }

  executeWithRequest = async (baseUrl: string) => {
    const { post, body } = this.config
    const { logger, feature, spec } = this.params
    logger.log(`posting "${JSON.stringify(body)}" to "${post}"`)
    const res = await fetch(`${baseUrl}${post}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new SpecError('POST_REQUEST_ERROR', {
        feature,
        spec,
        expected: '200',
        received: res.status.toString(),
      })
    }
  }
}
