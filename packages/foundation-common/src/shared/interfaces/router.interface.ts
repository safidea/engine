import { RouterMiddlewareType, ApiRequestInterface, ApiResponseInterface } from '@common'

export interface RouterInterface {
  all?(req: ApiRequestInterface, res: ApiResponseInterface): RouterMiddlewareType[]
  get?(req: ApiRequestInterface, res: ApiResponseInterface): RouterMiddlewareType[]
  post?(req: ApiRequestInterface, res: ApiResponseInterface): RouterMiddlewareType[]
  patch?(req: ApiRequestInterface, res: ApiResponseInterface): RouterMiddlewareType[]
  put?(req: ApiRequestInterface, res: ApiResponseInterface): RouterMiddlewareType[]
  delete?(req: ApiRequestInterface, res: ApiResponseInterface): RouterMiddlewareType[]
}
