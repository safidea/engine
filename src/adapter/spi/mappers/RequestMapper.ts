import { DeleteRequest } from '@domain/entities/Request/Delete'
import type { DeleteDto, GetDto, PatchDto, PostDto, RequestDto } from '../dtos/RequestDto'
import { GetRequest } from '@domain/entities/Request/Get'
import { PatchRequest } from '@domain/entities/Request/Patch'
import { PostRequest } from '@domain/entities/Request/Post'
import type { Request } from '@domain/entities/Request'

export class RequestMapper {
  static toService = (dto: RequestDto): Request => {
    const { method } = dto
    if (method === 'GET') {
      return new GetRequest(dto)
    }
    if (method === 'POST') {
      return new PostRequest(dto)
    }
    if (method === 'PATCH') {
      return new PatchRequest(dto)
    }
    if (method === 'DELETE') {
      return new DeleteRequest(dto)
    }
    throw new Error(`Unknown method ${method}`)
  }

  static toGetService = (dto: GetDto): GetRequest => {
    return new GetRequest(dto)
  }

  static toGetDto = (service: GetRequest): GetDto => {
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

  static toPostService = (dto: PostDto): PostRequest => {
    return new PostRequest(dto)
  }

  static toPostDto = (service: PostRequest): PostDto => {
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

  static toPatchService = (dto: PatchDto): PatchRequest => {
    return new PatchRequest(dto)
  }

  static toPatchDto = (service: PatchRequest): PatchDto => {
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

  static toDeleteService = (dto: DeleteDto): DeleteRequest => {
    return new DeleteRequest(dto)
  }

  static toDeleteDto = (service: DeleteRequest): DeleteDto => {
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
