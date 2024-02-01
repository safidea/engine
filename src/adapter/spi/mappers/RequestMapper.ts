import type { GetDto, PostDto } from '../dtos/RequestDto'
import { Get } from '@domain/services/Request/Get'
import { Post } from '@domain/services/Request/Post'

export class RequestMapper {
  static toGetService(dto: GetDto): Get {
    return new Get({
      path: dto.path,
      query: dto.query,
      params: dto.params,
    })
  }

  static toPostService(dto: PostDto): Post {
    return new Post({
      path: dto.path,
      query: dto.query,
      params: dto.params,
      body: dto.body,
    })
  }
}
