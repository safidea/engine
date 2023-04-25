import type { ApiRequestInterface, ApiResponseInterface, ApiMiddlewareType } from '@common'

export type RouterMiddlewareType = (
  req: ApiRequestInterface,
  res: ApiResponseInterface,
  next: ApiMiddlewareType
) => Promise<void | ApiResponseInterface>

export type RouterControllerType = (
  req: ApiRequestInterface,
  res: ApiResponseInterface
) => Promise<void | ApiResponseInterface>
