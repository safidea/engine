import { Delete } from '@domain/entities/Request/Delete'
import type { DeleteDto, GetDto, PatchDto, PostDto, RequestDto } from '../dtos/RequestDto'
import { Get } from '@domain/entities/Request/Get'
import { Patch } from '@domain/entities/Request/Patch'
import { Post } from '@domain/entities/Request/Post'
import type { Request } from '@domain/entities/Request'

export class RequestMapper {
  static toService = (dto: RequestDto): Request => {
    const { method } = dto
    if (method === 'GET') {
      return new Get(dto)
    }
    if (method === 'POST') {
      return new Post(dto)
    }
    if (method === 'PATCH') {
      return new Patch(dto)
    }
    if (method === 'DELETE') {
      return new Delete(dto)
    }
    throw new Error(`Unknown method ${method}`)
  }

  static toGetService = (dto: GetDto): Get => {
    return new Get(dto)
  }

  static toGetDto = (service: Get): GetDto => {
    const { path, baseUrl, headers, query, params } = service
    return {
      method: 'GET',
      path,
      baseUrl,
      headers,
      query,
      params,
    }
  }

  static toPostService = (dto: PostDto): Post => {
    return new Post(dto)
  }

  static toPostDto = (service: Post): PostDto => {
    const { path, baseUrl, headers, query, params, body } = service
    return {
      method: 'POST',
      path,
      baseUrl,
      headers,
      query,
      params,
      body,
    }
  }

  static toPatchService = (dto: PatchDto): Patch => {
    return new Patch(dto)
  }

  static toPatchDto = (service: Patch): PatchDto => {
    const { path, baseUrl, headers, query, params, body } = service
    return {
      method: 'PATCH',
      path,
      baseUrl,
      headers,
      query,
      params,
      body,
    }
  }

  static toDeleteService = (dto: DeleteDto): Delete => {
    return new Delete(dto)
  }

  static toDeleteDto = (service: Delete): DeleteDto => {
    const { path, baseUrl, headers, query, params } = service
    return {
      method: 'DELETE',
      path,
      baseUrl,
      headers,
      query,
      params,
    }
  }
}
